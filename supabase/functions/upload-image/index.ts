// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient, SupabaseClient } from 'jsr:@supabase/supabase-js@2'

console.log("Hello from upload-image!")

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, origin',
	'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

interface Image {
	name: string,
	status: number
}
interface AuthUser {
	id: string,
	role: string,
	email: string
}

async function createImage(supabaseClient: SupabaseClient, image: File | null, user: AuthUser) {
	console.log('createImage(): ', image);

	if (!image) {
		throw 'no_image'
	}
	const fileName = `${Date.now()}-${image.name}`;

	const { error: error1 } = await supabaseClient
		.storage
		.from('image_uploads')
		.upload(fileName, image, {
			cacheControl: '3600',
			contentType: image.type,
			upsert: false
		})
	if (error1) throw error1

	const { error: error2 } = await supabaseClient
		.from('image_uploads')
		.insert({ name: fileName, user_id: user.id })
	if (error2) throw error2

	return new Response(JSON.stringify({ success: true }), {
		headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		status: 200,
	})
}

Deno.serve(async (req) => {

	const { method } = req

	if (method === 'OPTIONS') {
		return new Response('ok', { headers: corsHeaders })
	}
	try {
		const abc = Deno.env.get('SUPABASE_URL')
		console.log('SUPABASE_URL: ', abc);
		const def = Deno.env.get('PUBLIC_SUPABASE_URL')
		console.log('PUBLIC_SUPABASE_URL: ', def);

		const supabaseClient = createClient(
			Deno.env.get('SUPABASE_URL') == 'http://kong:8000' ? Deno.env.get('PUBLIC_SUPABASE_URL') : Deno.env.get('SUPABASE_URL'),
			Deno.env.get('SUPABASE_URL') == 'http://kong:8000' ? Deno.env.get('PUBLIC_SUPABASE_ANON_KEY') : Deno.env.get('SUPABASE_ANON_KEY'),
			{
				global: {
					headers: { Authorization: `${req.headers.get('Authorization')}` }
				},
			}
		)

		const {
			data: { user }
		} = await supabaseClient.auth.getUser()
		console.log('user: ', user);

		const { data, error } = await supabaseClient.from('countries').select('*')
		if (error) throw error
		console.log('data.length: ', data.length);
		if (!user) {
			return new Response(JSON.stringify({ error: 'No user found.' }), {
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				status: 400,
			})
		}


		let image = null
		if (method === 'POST' || method === 'PUT') {
			console.log('POST request')
			const formData = await req.formData();
			console.log('formData: ', formData);
			image = formData.get('image') as File | null;
			console.log('image1: ', image);

			if (!image) {
				return new Response(JSON.stringify({ error: 'No image provided in form-data field.' }), {
					status: 400,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				});
			}
		}

		await createImage(supabaseClient, image, user)

		return new Response(JSON.stringify({
			user, message: "Success uploaded image!"
		}), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			status: 200,
		})
	} catch (error) {
		console.error(error)

		return new Response(JSON.stringify({ error: error.message }), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			status: 400,
		})
	}
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/upload-image' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
  --header 'Content-Type: application/json' \
  --data '{"name":"Functions"}'

*/
