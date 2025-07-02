import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PlaidLinkRequest {
  public_token: string;
  account_ids: string[];
  institution: {
    name: string;
    institution_id: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the session or user object
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data } = await supabaseClient.auth.getUser(token)
    const user = data.user

    if (!user) {
      throw new Error('No user found')
    }

    const PLAID_CLIENT_ID = Deno.env.get('PLAID_CLIENT_ID')
    const PLAID_SECRET = Deno.env.get('PLAID_SECRET')
    const PLAID_ENV = Deno.env.get('PLAID_ENV') || 'sandbox'

    if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
      throw new Error('Plaid credentials not configured')
    }

    if (req.method === 'POST') {
      const body: PlaidLinkRequest = await req.json()
      
      // Exchange public token for access token
      const plaidResponse = await fetch(`https://${PLAID_ENV}.plaid.com/link/token/exchange`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
          'PLAID-SECRET': PLAID_SECRET,
        },
        body: JSON.stringify({
          public_token: body.public_token
        })
      })

      if (!plaidResponse.ok) {
        throw new Error('Failed to exchange token with Plaid')
      }

      const { access_token, item_id } = await plaidResponse.json()

      // Get account information
      const accountsResponse = await fetch(`https://${PLAID_ENV}.plaid.com/accounts/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
          'PLAID-SECRET': PLAID_SECRET,
        },
        body: JSON.stringify({
          access_token: access_token
        })
      })

      if (!accountsResponse.ok) {
        throw new Error('Failed to fetch accounts from Plaid')
      }

      const accountsData = await accountsResponse.json()

      // Store account information in Supabase
      for (const account of accountsData.accounts) {
        const { error } = await supabaseClient
          .from('linked_accounts')
          .insert({
            user_id: user.id,
            plaid_item_id: item_id,
            plaid_access_token: access_token, // In production, encrypt this!
            account_id: account.account_id,
            institution_name: body.institution.name,
            account_name: account.name,
            account_type: account.type,
            account_subtype: account.subtype,
            current_balance: account.balances.current,
            available_balance: account.balances.available,
            mask: account.mask,
            is_active: true
          })

        if (error) {
          console.error('Error storing account:', error)
          throw error
        }
      }

      // Fetch initial transactions
      const transactionsResponse = await fetch(`https://${PLAID_ENV}.plaid.com/transactions/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
          'PLAID-SECRET': PLAID_SECRET,
        },
        body: JSON.stringify({
          access_token: access_token,
          start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 30 days
          end_date: new Date().toISOString().split('T')[0]
        })
      })

      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json()
        
        // Store transactions
        for (const transaction of transactionsData.transactions) {
          const { error } = await supabaseClient
            .from('plaid_transactions')
            .insert({
              user_id: user.id,
              account_id: transaction.account_id,
              transaction_id: transaction.transaction_id,
              amount: transaction.amount,
              description: transaction.name,
              merchant_name: transaction.merchant_name,
              category: transaction.category,
              transaction_date: transaction.date,
              account_owner: transaction.account_owner
            })

          if (error) {
            console.error('Error storing transaction:', error)
          }
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          accounts_linked: accountsData.accounts.length 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // GET request - Create link token
    if (req.method === 'GET') {
      const linkTokenResponse = await fetch(`https://${PLAID_ENV}.plaid.com/link/token/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
          'PLAID-SECRET': PLAID_SECRET,
        },
        body: JSON.stringify({
          client_name: 'Financr',
          country_codes: ['US'],
          language: 'en',
          user: {
            client_user_id: user.id
          },
          products: ['transactions', 'auth'],
          account_filters: {
            depository: {
              account_subtypes: ['checking', 'savings']
            },
            credit: {
              account_subtypes: ['credit card']
            }
          }
        })
      })

      if (!linkTokenResponse.ok) {
        throw new Error('Failed to create link token')
      }

      const { link_token } = await linkTokenResponse.json()

      return new Response(
        JSON.stringify({ link_token }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405,
      }
    )

  } catch (error) {
    console.error('Error in plaid-link function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})