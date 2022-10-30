<?php

namespace App\Repositories\Motorbike;

use App\Models\Motorbike;

class MotorbikeRepository implements MotorbikeRepositoryInterface 
{
    public function all() {
        return Motorbike::all();
    }

    public function show($id) {
        return Motorbike::find($id);
    }

    public function store($data, $image = null) {
        $motorbike = new Motorbike;
        $motorbike->renter_id = $data['renter_id'];
        $motorbike->license_plate = $data['license_plate'];
        if($image != null) {
            $upload_folder = Motorbike::motorbike_image_public_folder;
            $generated_name = hexdec(uniqid());
            $extension = $image->getClientOriginalExtension();
            $image_name = $generated_name.'.'.$extension;
            if(!file_exists($upload_folder)) {
                //mkdir($upload_folder);
                mkdir($upload_folder, 0777, true);
            $image->move($upload_folder, $image_name);
            $motorbike->motorbike_image = $upload_folder.$image_name;
            }
        }
        $motorbike->save();
        return $motorbike;
    }

    public function update($data, $id, $image = null) {
        $motorbike = $this::show($id);
        $motorbike->renter_id = $data['renter_id'];
        $motorbike->license_plate = $data['license_plate'];
        if($image != null) {
            $old_image = $motorbike->motorbike_image;
            $upload_folder = Motorbike::motorbike_image_public_folder;
            if(!file_exists($upload_folder)) {
                //mkdir($upload_folder);
                mkdir($upload_folder, 0777, true);
            }
            //Delete existed image
            File::delete($old_image);
            //Add new image
            $generated_name = hexdec(uniqid());
            $extension = $image->getClientOriginalExtension();
            $image_name = $generated_name.'.'.$extension;
            $image->move($upload_folder, $image_name);
            $motorbike->motorbike_image = $upload_folder.$image_name;
        }
        $motorbike->save();
        return $motorbike;
    }

    public function delete($id) {
        return $this::show($id)->delete();
    }
}