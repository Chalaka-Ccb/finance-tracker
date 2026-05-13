import { supabase } from '../config/supabase.js';
import { ApiError } from '../middleware/errorHandler.js';

function formatSessionResponse(data) {
	const payload = { user: data.user ?? null };

	if (data.session) {
		payload.access_token = data.session.access_token;
		payload.refresh_token = data.session.refresh_token;
	}

	return payload;
}

export async function register(req, res, next) {
	try {
		const { email, password, full_name } = req.body;

		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: full_name ? { data: { full_name } } : undefined,
		});

		if (error) throw new ApiError(error.message, 400);

		res.status(201).json(formatSessionResponse(data));
	} catch (err) {
		next(err);
	}
}

export async function login(req, res, next) {
	try {
		const { email, password } = req.body;

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) throw new ApiError(error.message, 401);
		if (!data.session) throw new ApiError('Login succeeded without a session.', 500);

		res.json(formatSessionResponse(data));
	} catch (err) {
		next(err);
	}
}

export async function logout(_req, res) {
	res.status(204).send();
}
