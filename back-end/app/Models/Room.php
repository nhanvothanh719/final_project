<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;
    
    protected $guarded = ['id'];
    protected $with = ['category', 'images'];

    const STATUS_EMPTY = 1;
    const STATUS_OCCUPIED = 2;
    const STATUS_FULL = 3;

    public function category() {
        return $this->belongsTo(Category::class,'category_id','id');
    }

    public function images() {
        return $this->hasMany(RoomImages::class, 'room_id', 'id');
    }

    public function renters() {
        return $this->hasManyThrough(User::class, RoomRent::class, 'room_id', 'id', 'id', 'id');
    }

    public function rent_requests() {
        return $this->hasMany(RoomRentRegistration::class, 'registered_room_id', 'id');
    }

    public function rents() {
        return $this->hasMany(RoomRent::class, 'room_id', 'id');
    }
}
