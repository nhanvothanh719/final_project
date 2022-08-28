<?php

namespace App\Http\Controllers;


use \stdClass;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

use App\Models\User;
use App\Models\Room;
use App\Models\Balance;
use App\Models\Service;
use App\Models\Invoice;
use App\Models\RoomRent;
use App\Models\InvoiceDetail;
use App\Models\PaymentHistory;
use App\Models\ServiceRegistration;

use App\Mail\InvoiceSendMail;

class InvoiceController extends Controller
{
    public function index() {
        $all_invoices = Invoice::all();
        return response([
            'status' => 200,
            'allInvoices' => $all_invoices,
        ]);
    }

    public function getRegisteredServices($id) {
        $user = User::find($id);
        if(!$user) {
            return response([
                'message' => 'Cannot create temporary invoice due to no user found',
                'status' => 404,
            ]);
        }
        $all_services = array();
        $registered_services_id = ServiceRegistration::where('user_id', $id)->pluck('service_id');
        foreach($registered_services_id as $service_id) {
            $service = Service::find($service_id);
            $item = new stdClass();
            $item->id = $service_id;
            $item->name = $service->name;
            $item->is_compulsory = $service->is_compulsory;
            $item->unit = $service->unit;
            $item->unit_price = $service->unit_price;
            $item->quantity = 0;
            array_push($all_services, $item);
        }
        $compulsory_services_id = Service::where('is_compulsory', Service::COMPULSORY)->pluck('id');
        foreach($compulsory_services_id as $service_id) {
            $service = Service::find($service_id);
            $item = new stdClass();
            $item->id = $service_id;
            $item->name = $service->name;
            $item->is_compulsory = $service->is_compulsory;
            $item->unit = $service->unit;
            $item->unit_price = $service->unit_price;
            $item->quantity = 0;
            array_push($all_services, $item);
        }
        return response([
            'status' => 200,
            'allServices' => $all_services,
        ]);
    }

    public function storeInvoice(Request $request, $id) {
        $current_year = date('Y');
        $appropriate_date = date('Y-m-d', strtotime(' +0 day'));
        $validator = Validator::make($request->all(), [
            'effective_from' => 'required|date|after_or_equal:'.$appropriate_date,
            'valid_until' => ['required', 'date', 'before_or_equal:'.date("Y-m-d", strtotime($appropriate_date."+15 day")), 'after_or_equal:'.date("Y-m-d", strtotime($appropriate_date."+1 day"))],
            'discount' => 'required|min:0|max:100',
            'month' => 'required|min:1|max:12',
            'extra_fee' => 'numeric|nullable',
        ]);
        if($validator->fails()) 
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        if($request->extra_fee) {
            if(!$request->description) {
                return response([
                    'message' => 'The description field is needed',
                    'status' => 404,
                ]);
            }
        }
        $user = User::find($id);
        if(!$user) {
            return response([
                'message' => 'No user found',
                'status' => 404,
            ]);
        }
        //Create invoice without calculating total
        $invoice = Invoice::create([
            'renter_id' => $id,
            'discount' => $request->discount,
            'month' => $request->month,
            'year' => $current_year,
            'effective_from' => $request->effective_from,
            'valid_until' => $request->valid_until,
            "extra_fee" => $request->extra_fee,
            'extra_fee_description' => $request->extra_fee_description,
        ]);
        //Create invoice details
        InvoiceController::storeInvoiceDetails($invoice->id, $request->services);
        //Update total value
        $total = InvoiceController::updateTotal($invoice->id, $request->discount);
        $current_invoice = Invoice::find($invoice->id);
        $current_invoice->total = round($total, 2);
        $current_invoice->save();
        return response([
            'message' => "Invoice created successfully",
            'status' => 200,
        ]);
    }

    public function storeInvoiceDetails($invoice_id, $services) {
        foreach($services as $service) {
            $invoice_detail = new InvoiceDetail;
            $invoice_detail->invoice_id = $invoice_id;
            $invoice_detail->service_id = $service['id'];
            $invoice_detail->quantity = abs($service['quantity']);
            $service_unit_price = abs($service['unit_price']);
            $invoice_detail->subtotal = round(abs($service['quantity']) * $service_unit_price, 2);
            $invoice_detail->save();
        }
    }

    public function updateTotal($invoice_id, $discount) {
        $total = 0;
        $services_subtotal = InvoiceDetail::where('invoice_id', $invoice_id)->pluck('subtotal');
        foreach($services_subtotal as $subtotal) {
            $total = $total + $subtotal;
        }
        if($discount !== 0) {
            $total = $total * (100 - $discount) / 100;
        }
        $extra_fee = Invoice::find($invoice_id)->extra_fee;
        if($extra_fee) {
            $extra_fee_value = ExtraFee::where('invoice_id', $invoice_id)->pluck('subtotal');
            $total = $total + $extra_fee_value;
        }
        return $total;
    }

    public function editInvoice($id) {
        $invoice = Invoice::find($id);
        $invoice_details = InvoiceDetail::where('invoice_id', $id)->get();
        $extra_fee = $invoice->extra_fee;
         if(!$extra_fee) {
             $extra_fee = 0;
         }
        if(!$invoice) {
            return response([
                'message' => 'No invoice found',
                'status' => 404,
            ]);
        }
        return response([
            'invoice' => $invoice,
            'invoiceDetails' => $invoice_details,
            'status' => 200,
        ]);
    }

    public function updateInvoice(Request $request, $id) {
        $appropriate_time = date('Y-m-d', strtotime(' +0 day'));
        $validator = Validator::make($request->all(), [
            'effective_from' => 'required|date|after_or_equal:'.$appropriate_time,
            'valid_until' => ['required', 'date', 'before_or_equal:'.date("Y-m-d", strtotime($appropriate_time."+15 day")), 'after_or_equal:'.date("Y-m-d", strtotime($appropriate_time."+1 day"))],
            'month' => 'required|min:1|max:12',
        ]);
        if($validator->fails()) 
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        $invoice = Invoice::find($id);
        if($invoice) {
            $invoice->effective_from = $request->effective_from;
            $invoice->valid_until = $request->valid_until;
            $invoice->month = $request->month;
            $invoice->save();
            return response([
                'message' => 'Successfully update invoice',
                'status' => 200,
            ]);
        } else {
            return response([
                'message' => 'No invoice found',
                'status' => 404,
            ]);
        }
    }
    
    public function deleteInvoice($id) {
        $invoice = Invoice::find($id);
        if(!$invoice) {
            return response([
                'message' => 'No invoice found',
                'status' => 404,
            ]);
        }
        if($invoice->is_paid == STATUS_PAID) {
            return response([
                'message' => 'Cannot delete since this invoice is paid',
                'status' => 404,
            ]);
        }
        InvoiceDetail::where('invoice_id', $id)->delete();
        PaymentHistory::where('invoice_id', $id)->delete();
        $invoice->delete();
        return response([
            'message' => 'Successfully delete invoice',
            'status' => 200,
        ]);
    }

    public function sendInvoice($id) {
        $invoice = Invoice::find($id);
        //
        $renter_id = Invoice::where('id', $id)->value('renter_id');
        $renter = User::find($renter_id);
        $renter_name = $renter->name;
        //
        $room_id = RoomRent::where('renter_id', $renter_id)->value('room_id');
        $room_number = Room::find($room_id)->number;
        //
        $invoice_details = InvoiceDetail::where('invoice_id', $id)->get();
        if(!$renter) {
            return response([
                'message' => 'No renter found',
                'status' => 404,
            ]);
        }
        Mail::to($renter->email)->send(new InvoiceSendMail($renter_name, $room_number, $invoice, $invoice_details)); 
        return response([
            'message' => 'Successfully send invoice to the renter',
            'status' => 200,
        ]);
    }

    public function getRenterInvoices($id) {
        $renter = User::find($id);
        if(!$renter) {
            return response([
                'message' => 'No renter found',
                'status' => 404,
            ]);
        }
        $all_invoices = Invoice::where('renter_id', $id)->get();
        
        return response([
            'status' => 200,
            'allInvoices' => $all_invoices,
            'servicesCount' => InvoiceController::countUsedServices($id),
        ]);
    }

    public function countUsedServices($id) {
        $services_count = array();
        $services_id = Service::pluck('id')->toArray();
        $renter_invoices_id = Invoice::where('renter_id', $id)->pluck('id');
        //Get all invoices belonging to renter
        foreach($services_id as $service_id) {
            $count = 0;
            foreach($renter_invoices_id as $invoice_id) {
                $services_id_in_invoice_details = InvoiceDetail::where('invoice_id', $invoice_id)->pluck('service_id');
                foreach($services_id_in_invoice_details as $detail_service_id) {
                    if($detail_service_id == $service_id) {
                        $count++;
                    }
                }
            }
            $item = new stdClass(); //stdClass is a generic 'empty' class used when casting other types to objects
            $item->service_name = Service::where('id', $service_id)->value('name');
            $item->total = $count;
            array_push($services_count, $item);
        }
        return $services_count;
        
    }
}
