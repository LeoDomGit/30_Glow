<?php

namespace App\Http\Controllers\Bookings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Bookings\BookingRequest;
use App\Models\BookingHasService;
use App\Models\Bookings;
use App\Models\Customers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function __construct()
    {
        $this->model = Bookings::class;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->crumbs = [
            ['name' => 'Dịch vụ', 'url' => '/admin/services'],
            ['name' => 'Danh sách dịch vụ đặt lịch', 'url' => '/admin/bookings'],
        ];
        $this->data = $this->model::with('customer', 'services')->get();
        return Inertia::render('Bookings/Index', ['bookings' => $this->data, 'crumbs' => $this->crumbs]);
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
    public function store(BookingRequest $request)
    {
        DB::beginTransaction();
        try {
            $this->data = $request->validated();
            $this->instance = Customers::where('email', $this->data['email'])->where('phone', $this->data['phone'])->active()->first();

            if ($this->instance) {
                $customerId = $this->instance->id;
            } else {
                $password = Str::random(10);
                $customerId = Customers::insertGetId(['name' => $this->data['name'], 'email' => $this->data['email'], 'phone' => $this->data['phone'], 'password' => Hash::make($password),]);
            }

            $booking = $this->model::insertGetId([
                'id_user' => $this->data['id_user'] ?? null,
                'id_customer' => $customerId,
                'time' => $this->data['time'],
            ]);

            if ($booking) {
                foreach ($this->data['service'] as $item) {
                    BookingHasService::create(['id_booking' => $booking, 'id_service' => $item,]);
                }
            }

            DB::commit();
            return response()->json(['check' => true, 'message' => 'Đặt lịch thành công!'], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Booking failed: " . $e->getMessage());
            return response()->json(['check' => false, 'message' => 'Đặt lịch thất bại!'], 400);
        }
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
    public function update(BookingRequest $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
