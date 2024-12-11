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
async function getImages(supabaseClient: SupabaseClient) {
	const { data: images, error } = await supabaseClient.from('image_uploads').select('*')
	if (error) throw error

	return new Response(JSON.stringify({ images }), {
		headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		status: 200,
	})
}

async function createImage(supabaseClient: SupabaseClient, image: File | null, user: AuthUser) {
	console.log('createImage(): ', image);

	if (!image) {
		throw 'no_image'
	}
	const fileName = `${Date.now()}-${image.name}`;
	console.log('image2: ', image);

	const { data: data1, error: error1 } = await supabaseClient
		.storage
		.from('image_uploads')
		.upload(fileName, image, {
			cacheControl: '3600',
			contentType: image.type,
			upsert: false
		})
	if (error1) throw error1

	const { data: data2, error: error2 } = await supabaseClient
		.from('image_uploads')
		.insert({ name: fileName, user_id: user.id })

	if (error2) throw error2

	return new Response(JSON.stringify({ success: true }), {
		headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		status: 200,
	})
}


Deno.serve(async (req) => {

	const { url, method } = req

	if (method === 'OPTIONS') {
		return new Response('ok', { headers: corsHeaders })
	}

	try {
		// Create a Supabase client with the Auth context of the logged in user.
		const supabaseClient = createClient(
			// Supabase API URL - env var exported by default.
			Deno.env.get('SUPABASE_URL') ?? '',
			// Supabase API ANON KEY - env var exported by default.
			// Deno.env.get('SUPABASE_ANON_KEY') ?? '',
			Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
			// { global: { headers: { Authorization: req.headers.get('Authorization') } } }
			// Create client with Auth context of the user that called the function.
			// This way your row-level-security (RLS) policies are applied.
			{
				global: {
					headers: { Authorization: req.headers.get('Authorization')! },
				},
			}
		)

		// First get the token from the Authorization header
		const token = req.headers.get('Authorization')?.replace('Bearer ', '')
		console.log('token: ', token);

		// Now we can get the session or user object
		const { data: { user } } = await supabaseClient.auth.getUser(token)
		console.log('user: ', user);

		// Get the session or user object
		// const authHeader = req.headers.get('Authorization')!
		// const token = authHeader.replace('Bearer ', '')
		// const { data } = await supabaseClient.auth.getUser(token)
		// const user = data.user
		// console.log('user: ', user);

		// For more details on URLPattern, check https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API
		const taskPattern = new URLPattern({ pathname: '/restful-tasks/:id' })
		const matchingPath = taskPattern.exec(url)
		const id = matchingPath ? matchingPath.pathname.groups.id : null

		let image = null
		// let formData = null
		if (method === 'POST' || method === 'PUT') {
			console.log('POST request')
			// const body = await req.json()
			// image = body.image
			const formData = await req.formData();
			console.log('formData: ', formData);
			image = formData.get('image') as File | null;
			console.log('image1: ', image);

			if (!image) {
				return new Response(JSON.stringify({ error: 'No image provided' }), {
					status: 400,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				});
			}
		}

		// call relevant method based on method and id
		switch (true) {
			case id && method === 'GET':
				return getImages(supabaseClient)
			// return getTask(supabaseClient, id as string)
			case id && method === 'PUT':
				return getImages(supabaseClient)
			// return updateTask(supabaseClient, id as string, task)
			case id && method === 'DELETE':
				return getImages(supabaseClient)
			// return deleteTask(supabaseClient, id as string)
			case method === 'POST':
				// return getAllImages(supabaseClient)
				return createImage(supabaseClient, image, user)
			case method === 'GET':
				return getImages(supabaseClient)
			// return getAllTasks(supabaseClient)
			default:
				return getImages(supabaseClient)
		}
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
