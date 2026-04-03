const express = require('express');
const Notification = require('../models/Notification.js'); 


// GET ROUTES

/* 
    Purpose: General Use
    Description: Get all the fields in the collection
*/

exports.getNotificationsOfUser = async (req, res) =>{
    try {
        const adminId = req.session.userId;

        const notifs = await Notification.find({ isRead: false })
            .populate({
                path: 'brokenId',
                populate: {
                    path: 'seats',
                    populate: {
                        path: 'room_id'
                    }
                }
            })
            .populate({
                path: 'reservationId',
                populate: [
                    { path: 'reservedBy', model: 'User' },
                    {
                        path: 'seats',
                        populate: { path: 'room_id' }
                    }
                ]
            });

        const mappedNotifs = notifs
            .filter(notif =>
                notif.reservationId &&
                notif.reservationId.reservedBy &&
                notif.reservationId.reservedBy._id.toString() === adminId.toString()
            )
            .map(notif => {
                const reservation = notif.reservationId;
                const broken = notif.brokenId;

                return {
                    _id: notif._id,
                    reservationStart: reservation?.reservation_start_timestamp || null,
                    reservationEnd: reservation?.reservation_end_timestamp || null,
                    reason: broken?.reason || null,
                    room_name: reservation?.seats?.[0]?.room_id?.room_name || broken?.seats?.[0]?.room_id?.room_name || null,
                    building: reservation?.seats?.[0]?.room_id?.building || broken?.seats?.[0]?.room_id?.building || null,
                    brokenSeats: broken?.seats?.map(seat => seat.seat_name) || [],
                    reservationSeats: reservation?.seats?.map(seat => seat.seat_name) || [],
                    brokenTimestamp: broken?.broken_start_timestamp
                };
            });

        console.log(mappedNotifs);

        res.json(mappedNotifs);

    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
};

exports.getNotificationsOfAdmin = async (req, res) => {
    try {
        const adminId = req.session.adminId;

        const notifs = await Notification.find({ isRead: false })
            .populate({
                path: 'brokenId',
                populate: {
                    path: 'seats',
                    populate: {
                        path: 'room_id'
                    }
                }
            })
            .populate({
                path: 'reservationId',
                populate: [
                    { path: 'reservedBy', model: 'Admin' },
                    {
                        path: 'seats',
                        populate: { path: 'room_id' }
                    }
                ]
            });

        const mappedNotifs = notifs
            .filter(notif =>
                notif.reservationId &&
                notif.reservationId.reservedBy &&
                notif.reservationId.reservedBy._id.toString() === adminId.toString()
            )
            .map(notif => {
                const reservation = notif.reservationId;
                const broken = notif.brokenId;

                return {
                    _id: notif._id,
                    reservationStart: reservation?.reservation_start_timestamp || null,
                    reservationEnd: reservation?.reservation_end_timestamp || null,
                    reason: broken?.reason || null,
                    room_name: reservation?.seats?.[0]?.room_id?.room_name || broken?.seats?.[0]?.room_id?.room_name || null,
                    building: reservation?.seats?.[0]?.room_id?.building || broken?.seats?.[0]?.room_id?.building || null,
                    brokenSeats: broken?.seats?.map(seat => seat.seat_name) || [],
                    reservationSeats: reservation?.seats?.map(seat => seat.seat_name) || [],
                    brokenTimestamp: broken?.broken_start_timestamp
                };
            });

        console.log(mappedNotifs);

        res.json(mappedNotifs);

    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
};
exports.addNotification = async (req, res) =>{
    try{
        const brokenId = req.body.brokenId
        const reservationId = req.body.reservationId
        const notifs = await Notification.create({ 
            reservationId: reservationId,
            brokenId: brokenId,
            isRead : false, 
        })

        res.json(notifs)
    }
    catch (err){
        console.error(err);
        res.status(500).send("Error");
    }
};

exports.readNotification = async (req, res) =>{
    try{
        const notifId = req.params.notifId

        const notif = await Notification.findByIdAndUpdate( notifId, { isRead : true })

        res.json(notif)
    }
    catch (err){
        console.error(err);
        res.status(500).send("Error");
    }
};