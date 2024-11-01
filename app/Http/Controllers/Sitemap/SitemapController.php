<?php

namespace App\Http\Controllers\Sitemap;

use App\Http\Controllers\Controller;
use App\Http\Requests\Sitemap\SitemapRequest;
use App\Models\Sitemap;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SitemapController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function __construct()
    {
        $this->model = Sitemap::class;
    }
    public function index()
    {
        $this->crumbs = [
            ['name' => 'Sitemap', 'url' => '/admin/sitemaps'],
        ];
        $this->data = $this->model::all();
        // dd($this->data, $this->instance);
        return Inertia::render('Sitemap/Index', ['sitemap' => $this->data, 'crumbs' => $this->crumbs]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SitemapRequest $request)
    {
        //t kh gọi Request từ SitemapRequest
        $this->data = $request->validate([
            'page' => 'required|string|max:255',
            'url' => 'required|max:255',
            'content' => ['required', 'string'],
            'static_page' => 'required|integer',
        ]);

        $this->data['stastus'] = 1;
        $this->instance = $this->model::create($this->data);

        if ($this->instance) {
            $this->data = $this->model::all();
            return response()->json(['check' => true, 'message' => 'Tạo thành công!', 'data' => $this->data], 201);
        }
        return response()->json(['check' => false, 'message' => 'Tạo thất bại!'], 400);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $this->crumbs = [
            ['name' => 'Sitemap', 'url' => '/admin/Sitemap'],
            ['name' => 'Danh sách Sitemap', 'url' => '/admin/Sitemap'],
            ['name' => 'Chi tiết Sitemap', 'url' => '/admin/Sitemap/' . $id . '/edit'],
        ];
        $this->data = $this->model::findOrFail($id);
        // dd($this->data);
        return Inertia::render('Sitemap/Edit', ['sitemap' => $this->data, 'crumbs' => $this->crumbs]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SitemapRequest $request, $id)
    {
        $this->data = $request->validated();
        $this->instance = $this->model::findOrFail($id)->update($this->data);
        if ($this->instance) {
            $this->data = $this->model::all();
            return response()->json(['check' => true, 'message' => 'Cập nhật thành công!', 'data' => $this->data], 200);
        }
        return response()->json(['check' => false, 'message' => 'Cập nhật thất bại!'], 400);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $this->instance = $this->model::findOrFail($id)->delete();
        if ($this->instance) {
            $this->data = $this->model::all();
            return response()->json(['check' => true, 'message' => 'Xoá thành công!', 'data' => $this->data], 200);
        }
        return response()->json(['check' => false, 'message' => 'Xoá thất bại!'], 400);
    }
}
