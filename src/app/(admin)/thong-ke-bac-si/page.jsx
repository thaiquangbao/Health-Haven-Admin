'use client'
import ChartConsultingTurn from '@/components/admin/thong-ke-bac-si/ChartConsultingTurn';
import ChartRevenue from '@/components/admin/thong-ke-bac-si/ChartRevenue';
import DetailDoctor from '@/components/admin/thong-ke-bac-si/DetailDoctor';
import Header from '@/components/header'
import Navbar from '@/components/menu/navbar'
import { api, TypeHTTP } from '@/utils/api';
import { compareDate1GetterThanDate2, convertDateToDayMonthYearObject } from '@/utils/date';
import React, { useEffect, useState } from 'react'

const ThongKeBacSi = () => {
    const [doctorRecords, setDoctorRecords] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [appointmentHomes, setAppointmentHomes] = useState([]);
    const [healthLogBooks, setHealthLogBooks] = useState([]);
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [readyAppointment, setReadyAppointment] = useState(false)
    const [readyAppointmentHome, setReadyAppointmentHome] = useState(false)
    const [readyLogBook, setReadyLogBook] = useState(false)
    const [type, setType] = useState('1')
    const [reload, setReload] = useState(true)
    const [currentDoctor, setCurrentDoctor] = useState()
    const [doctorSuggests, setDoctorSuggests] = useState([])

    useEffect(() => {
        api({
            type: TypeHTTP.GET,
            path: "/doctorSuggests/get-all",
            sendToken: false,
        }).then((res) => {
            setDoctorSuggests(res)
        });
    }, [])

    useEffect(() => {
        const currentDate = new Date();

        // Ngày đầu tiên của tháng hiện tại và tăng thêm 1 ngày
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1);
        setFromDate(firstDayOfMonth.toISOString().split('T')[0]);

        // Ngày cuối cùng của tháng hiện tại và tăng thêm 1 ngày
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        lastDayOfMonth.setDate(lastDayOfMonth.getDate() + 1);
        setToDate(lastDayOfMonth.toISOString().split('T')[0]);
    }, []);

    useEffect(() => {
        api({
            type: TypeHTTP.GET,
            path: "/doctorRecords/getAll",
            sendToken: false,
        }).then((res) => setDoctorRecords(res));

        // appointment
        api({
            type: TypeHTTP.GET,
            path: "/admin/get-all-appointments",
            sendToken: true,
        }).then((res) => {
            // filter complete
            let app = res.filter(
                (item) => item.status === "COMPLETED"
            );
            // filter by date
            app = app.filter(item => {
                return (compareDate1GetterThanDate2(item.appointment_date, convertDateToDayMonthYearObject(fromDate)) === true &&
                    compareDate1GetterThanDate2(convertDateToDayMonthYearObject(toDate), item.appointment_date)
                )
            })
            setAppointments(app)
            setReadyAppointment(true)
        });

        // appointmentHome
        api({
            type: TypeHTTP.GET,
            path: `/admin/get-all-appointmentHomes`,
            sendToken: true,
        })
            .then((res) => {
                // filter complete
                let app = res.filter(
                    (item) => item.status.status_type === "COMPLETED"
                );
                // filter by date
                app = app.filter(item => {
                    return (compareDate1GetterThanDate2(item.appointment_date, convertDateToDayMonthYearObject(fromDate)) === true &&
                        compareDate1GetterThanDate2(convertDateToDayMonthYearObject(toDate), item.appointment_date)
                    )
                })
                setAppointmentHomes(app)
                setReadyAppointmentHome(true)
            });

        // healthlogbooks
        api({
            path: "/admin/get-all-logBooks",
            type: TypeHTTP.GET,
            sendToken: true,
        })
            .then((res) => {
                // filter complete
                let app = res.filter(
                    (item) => item.status.status_type === "COMPLETED"
                );
                // filter by date
                app = app.filter(item => {
                    return (compareDate1GetterThanDate2(item.dateStop, convertDateToDayMonthYearObject(fromDate)) === true &&
                        compareDate1GetterThanDate2(convertDateToDayMonthYearObject(toDate), item.dateStop)
                    )
                })
                setHealthLogBooks(app)
                setReadyLogBook(true)
            });
    }, [fromDate, toDate, reload]);
    return (
        <section className="h-screen w-full flex z-0">
            <Navbar />
            <div className="w-full min-h-screen relative flex flex-col gap-3">
                <div className='w-full h-full flex'>
                    <div style={{ marginLeft: `-${currentDoctor ? 100 : 0}%`, transition: '0.5s' }} className='flex w-full h-full'>
                        <div className='min-w-[100%] h-full flex flex-col gap-3 px-4'>
                            <Header
                                image={"/calendar.png"}
                                text={"Thống Kê Bác Sĩ"}
                            />
                            <div className='w-full flex items-center justify-between px-2'>
                                <div className='flex items-center text-[15px] gap-2'>
                                    <span className='font-semibold'>Thống kê từ ngày</span>
                                    <input value={fromDate} onChange={e => setFromDate(e.target.value)} type='date' className='px-4 py-1 border-[1px] border-[#dadada] rounded-md' />
                                    <span className='font-semibold'>đến ngày</span>
                                    <input value={toDate} onChange={e => setToDate(e.target.value)} type='date' className='px-4 py-1 border-[1px] border-[#dadada] rounded-md' />
                                    <button style={{ background: 'linear-gradient(to right, #36d1dc, #5b86e5)' }} onClick={() => setReload(!reload)} className='text-[14px] px-4 transition-all hover:scale-[1.05] py-1 rounded-md text-[white]'>
                                        Tải Lại
                                    </button>
                                </div>
                                <select value={type} onChange={e => setType(e.target.value)} className='px-4 py-1 border-[1px] border-[#dadada] rounded-md text-[14px] focus:outline-0'>
                                    <option value={'1'}>Thống Kê Doanh Thu</option>
                                    <option value={'2'}>Thông Kê Lượt Khám</option>
                                </select>
                            </div>
                            {type === '1' ? (
                                <ChartRevenue doctorSuggests={doctorSuggests} setCurrentDoctor={setCurrentDoctor} fromDate={fromDate} toDate={toDate} readyLogBook={readyLogBook} healthLogBooks={healthLogBooks} readyAppointment={readyAppointment} readyAppointmentHome={readyAppointmentHome} doctorRecords={doctorRecords} appointments={appointments} appointmentHomes={appointmentHomes} />
                            ) : (
                                <ChartConsultingTurn doctorSuggests={doctorSuggests} setCurrentDoctor={setCurrentDoctor} fromDate={fromDate} toDate={toDate} readyLogBook={readyLogBook} healthLogBooks={healthLogBooks} readyAppointment={readyAppointment} readyAppointmentHome={readyAppointmentHome} doctorRecords={doctorRecords} appointments={appointments} appointmentHomes={appointmentHomes} />
                            )}
                        </div>
                        <DetailDoctor setDoctorSuggests={setDoctorSuggests} doctorSuggests={doctorSuggests} fromDate={fromDate} toDate={toDate} currentDoctor={currentDoctor} setCurrentDoctor={setCurrentDoctor} doctorRecords={doctorRecords} healthLogBooks={healthLogBooks} appointments={appointments} appointmentHomes={appointmentHomes} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ThongKeBacSi