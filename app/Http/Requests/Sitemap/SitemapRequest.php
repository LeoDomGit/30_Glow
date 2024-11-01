<?php

namespace App\Http\Requests\Sitemap;

use App\Http\Requests\BaseRequest;
use Illuminate\Foundation\Http\FormRequest;

class SitemapRequest extends BaseRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function methodPost()
    {
        return [
            'page' => 'required|string|max:255',
            'content' => 'required|string',
            'url' => 'required|url|max:255',
            'static_page' => 'required|integer'
        ];
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function methodPut()
    {
        return [
            'page' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'url' => 'nullable|max:255',
            'status' => 'nullable | boolean',
            'static_page' => 'required|boolean',
        ];
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function methodDelete()
    {
        return [];
    }
}
