<?php

namespace App\Http\Controllers\ServicesCollections;

use App\Http\Controllers\Controller;
use App\Http\Requests\ServicesCollections\ServiceCollectionsrRequest;
use App\Models\ServicesCollections;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ServiceCollectionsContoller extends Controller
{
    public function __construct()
    {
        $this->model = ServicesCollections::class;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->crumbs = [
            ['name' => 'Dịch vụ', 'url' => '/admin/services'],
            ['name' => 'Danh sách dịch vụ', 'url' => '/admin/service-collections'],
        ];
        $this->data = $this->model::all();
        return Inertia::render('ServicesCollections/Index', ['collections' => $this->data, 'crumbs' => $this->crumbs]);
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
    public function store(ServiceCollectionsrRequest $request)
    {
        $this->data = $request->validated();
        $this->data['slug'] = Str::slug($this->data['name']);
        $this->instance = $this->model::create($this->data);
        if ($this->instance) {
            $this->data = $this->model::all();
            return response()->json(['check' => true, 'message' => 'Thêm thành công!', 'data' => $this->data], 201);
        }
        return response()->json(['check' => false, 'message' => 'Thêm thất bại!'], 400);
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ServiceCollectionsrRequest $request, string $id)
    {
        $this->data = $request->validated();
        if (isset($this->data['name'])) $this->data['slug'] = Str::slug($this->data['name']);
        $this->instance = $this->model::findOrFail($id)->update($this->data);
        if ($this->instance) {
            $this->data = $this->model::all();
            return response()->json(['check' => true, 'message' => 'Cập nhật thành công!', 'data' => $this->data], 200);
        }
        return response()->json(['check' => false, 'message' => 'Cập nhật thất bại!'], 400);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->instance = $this->model::findOrFail($id)->delete();
        if ($this->instance) {
            $this->data = $this->model::all();
            return response()->json(['check' => true, 'message' => 'Xóa thành công!', 'data' => $this->data], 200);
        }
        return response()->json(['check' => false, 'message' => 'Xóa thất bại!'], 400);
    }

    /**
     * API Client
     */
    public function apiHighlighted()
    {
        $this->data = $this->model::highlighted()->select('id', 'name', 'slug', 'status', 'highlighted')->whereHas('services')->orderBy('id', 'asc')->get();
        return $this->data;
    }

    public function apiIndex()
    {
        $this->data = $this->model::active()->select('id', 'name', 'slug', 'status', 'highlighted')->whereHas('services')->orderBy('id', 'asc')->get();
        return $this->data;
    }

    public function apiShow($slug)
    {
        $this->data = $this->model::active()->select('id', 'name', 'slug', 'status', 'highlighted')->whereHas('services')->where('slug', $slug)->firstOrFail();

        if (!$this->data) {
            return response()->json(['check' => false, 'message' => 'Không tìm thấy dịch vụ!'], 404);
        }
        return $this->data;
    }
}
