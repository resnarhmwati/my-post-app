<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class PostController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum', except: ['index', 'show'])
        ];
    }

    public function index()
    {
        return Post::with('user')->latest()->get();
    }

    public function store(Request $request)
    {
        $fields = $request->validate([
            'title' => 'required|max:255',
            'body'  => 'required',
        ]);

        $post = $request->user()->posts()->create($fields);

        // Load user agar React bisa baca post.user.name
        return ['post' => $post->load('user')];
    }

    public function show(Post $post)
    {
        return ['post' => $post->load('user')];
    }

    public function update(Request $request, Post $post)
    {
        Gate::authorize('modify', $post);

        $fields = $request->validate([
            'title' => 'required|max:255',
            'body'  => 'required',
        ]);

        $post->update($fields);

        return ['post' => $post->load('user')];
    }

    public function destroy(Post $post)
    {
        Gate::authorize('modify', $post);
        $post->delete();

        return ['message' => 'The post was deleted'];
    }
}
