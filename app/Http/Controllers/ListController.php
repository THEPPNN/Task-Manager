<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TaskList;
use Illuminate\Support\Facades\Auth;

class ListController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $lists = TaskList::where('user_id', Auth::id())
            ->get();

        return Inertia::render('Lists/index', [
            'lists' => $lists,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // ✅ validation
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        // ✅ create list
        TaskList::create([
            ...$validated,
            'user_id' => Auth::id(),
        ]);

        return redirect()->route('lists.index')->with('success', 'List created successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TaskList $list)
    {
        // ✅ ตรวจสอบสิทธิ์
        if ($list->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        // ✅ update
        $list->update($validated);

        return redirect()->route('lists.index')->with('success', 'List updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TaskList $list)
    {
        if ($list->user_id !== Auth::id()) {
            abort(403);
        }

        $list->delete();

        return redirect()->route('lists.index')->with('success', 'List deleted successfully');
    }
}
