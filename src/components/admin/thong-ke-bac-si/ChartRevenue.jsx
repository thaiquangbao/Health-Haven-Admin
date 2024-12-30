import React, { useEffect, useRef, useState } from 'react'
import { CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { api, TypeHTTP } from '@/utils/api';
import { Chart } from "chart.js/auto";
import { formatMoney } from '@/utils/others';

const ChartRevenue = ({ doctorSuggests, setCurrentDoctor, fromDate, toDate, doctorRecords, appointments, healthLogBooks, appointmentHomes, readyAppointment, readyAppointmentHome, readyLogBook }) => {

    const [top5Doctor, setTop5Doctor] = useState([]);
    const [allTopDoctor, setAllTopDoctor] = useState([])
    const [labels, setLabels] = useState([])
    const [consultationData, setConsultationData] = useState([])
    const [revenueData, setRevenueData] = useState([])
    const chartRef = useRef()
    useEffect(() => {
        if (doctorRecords.length > 0 && readyAppointment === true && readyAppointmentHome === true && readyLogBook === true) {
            // Ghép thông tin bác sĩ vào từng cuộc hẹn
            let arr1 = appointments.map((item) => {
                const filter = doctorRecords.find(
                    (item1) => item1._id === item.doctor_record_id
                );
                return { ...item, doctorRecord: filter };
            });

            // Ghép thông tin bác sĩ vào từng cuộc hẹn tại nhà
            let arr2 = appointmentHomes.map((item) => {
                const filter = doctorRecords.find(
                    (item1) => {
                        return item1._id === item.doctor_record_id
                    }
                );
                return { ...item, doctorRecord: filter };
            });

            // Ghép thông tin bác sĩ vào từng phiếu theo dõi sức khỏe
            let arr3 = healthLogBooks.map((item) => {
                const filter = doctorRecords.find(
                    (item1) => {
                        return item1.doctor._id === item.doctor._id
                    }
                );
                return { ...item, doctorRecord: filter, doctor_record_id: filter._id };
            });
            // Lọc ra các bác sĩ duy nhất trong danh sách hẹn
            let arr = [];
            [...arr1, ...arr2, ...arr3].forEach((item) => {
                if (!arr.some((item1) => item1._id === item.doctor_record_id)) {
                    arr.push(item.doctorRecord);
                }
            });

            // Tính doanh thu và số lượng hẹn khám cho từng bác sĩ
            arr = arr.map((item) => {
                const filter = arr1.filter(
                    (item1) => item1.doctor_record_id === item._id
                );
                const filter1 = arr2.filter(
                    (item1) => {
                        return item1.doctor_record_id === item._id
                    }
                );
                const filter2 = arr3.filter(
                    (item1) => {
                        return item1.doctorRecord._id === item._id
                    }
                );
                return {
                    doctor: item.doctor,
                    totalAppointments: filter.length,
                    totalAppointmentHomes: filter1.length,
                    totalLogBooks: filter2.length,
                    totalPrice:
                        // tổng doanh thu trực tuyến 
                        filter.reduce(
                            (acc, item1) => acc + item1.price_list.price * 0.7,
                            0
                        ) +
                        // tổng doanh thu tại nhà 
                        filter1.reduce(
                            (acc, item1) => acc + item1.price_list.price * 0.7,
                            0
                        )
                        +
                        // tổng doanh thu theo dõi sức khỏe
                        filter2.reduce(
                            (acc, item1) => acc + item1.priceList.price * 0.7,
                            0
                        )
                };
            });

            // console.log(arr2)

            // Sắp xếp danh sách bác sĩ theo số lượng hẹn khám và doanh thu
            const topDoctors = JSON.parse(JSON.stringify(arr)).sort((a, b) => b.totalPrice - a.totalPrice).slice(0, 5)// Lấy top 5

            console.log(arr.sort((a, b) => b.totalPrice - a.totalPrice))

            // nếu top 5 chưa đủ 5 thì lấy mấy bác sĩ 0 cho đủ 5
            if (topDoctors.length < 5) {
                for (let i = topDoctors.length; i < 5; i++) {
                    const doctor = doctorRecords.filter(item => {
                        if (!topDoctors.map(item1 => item1.doctor._id).includes(item.doctor._id)) {
                            return item
                        }
                    })[0]
                    topDoctors.push({
                        doctor: doctor.doctor,
                        totalAppointments: 0,
                        totalAppointmentHomes: 0,
                        totalLogBooks: 0,
                        totalPrice: 0
                    })
                }
            }
            setTop5Doctor(topDoctors)

            // lấy tổng hợp doanh thu của từng bác sĩ
            const topDoctorsAll = JSON.parse(JSON.stringify(arr))
                .sort((a, b) => {
                    if (b.totalAppointments !== a.totalAppointments) {
                        return b.totalAppointments - a.totalAppointments;
                    }
                    return b.totalPrice - a.totalPrice;
                })
                .slice(0, doctorRecords.length - 1);

            for (let i = topDoctorsAll.length; i < doctorRecords.length; i++) {
                const doctor = doctorRecords.filter(item => {
                    if (!topDoctorsAll.map(item1 => item1.doctor._id).includes(item.doctor._id)) {
                        return item
                    }
                })[0]
                topDoctorsAll.push({
                    doctor: doctor.doctor,
                    totalAppointments: 0,
                    totalAppointmentHomes: 0,
                    totalLogBooks: 0,
                    totalPrice: 0
                })
            }
            setAllTopDoctor(topDoctorsAll.sort((a, b) => b.totalPrice - a.totalPrice))
        }
    }, [doctorRecords, readyAppointment, readyAppointmentHome, appointmentHomes, appointments, healthLogBooks, readyLogBook]);

    useEffect(() => {
        if (top5Doctor.length > 0) {
            // Tạo 5 labels theo top 5
            setLabels(top5Doctor.map(item => 'BS. ' + item.doctor.fullName.split(' ')[item.doctor.fullName.split(' ').length - 2] + " " + item.doctor.fullName.split(' ')[item.doctor.fullName.split(' ').length - 1]))

            // Tạo 5 Số lượng khám theo top 5
            setConsultationData(top5Doctor.map(item => item.totalAppointments))

            // Tạo 5 doanh thu theo top 5
            setRevenueData(top5Doctor.map(item => item.totalPrice))
        }
    }, [top5Doctor])


    useEffect(() => {
        if (chartRef.current && labels.length === 5 && consultationData.length === 5 && revenueData.length === 5 && chartRef.current) {
            if (chartRef.current.chart) {
                // Hủy biểu đồ cũ nếu có
                chartRef.current.chart.destroy();
            }
            let delayed;
            const newChart = new Chart(chartRef.current, {
                type: "bar",
                data: {
                    labels,
                    datasets: [
                        {
                            label: 'Doanh thu',
                            data: revenueData,
                            backgroundColor: '#4edcc1',
                            borderColor: "#4edcc1",
                            borderWidth: 1,
                            borderRadius: 5,
                            maxBarThickness: 60,
                        },
                    ],
                },
                options: {
                    animation: {
                        onComplete: () => {
                            delayed = true;
                        },
                        delay: (context) => {
                            let delay = 0;
                            if (context.type === 'data' && context.mode === 'default' && !delayed) {
                                delay = context.dataIndex * 300 + context.datasetIndex * 100;
                            }
                            return delay;
                        },
                    },
                    // responsive: true,
                    plugins: {
                        legend: { position: 'bottom' },
                        subtitle: { // Sử dụng subtitle để đặt tiêu đề ở dưới
                            display: true,
                            text: `Top 5 bác sĩ có doanh thu cao nhất từ ${fromDate} đến ${toDate}`,
                            position: 'bottom', // Đặt vị trí ở dưới
                            padding: { top: 10, bottom: 20 }, // Tùy chỉnh khoảng cách
                            font: {
                                size: 14
                            }
                        }
                    },
                    scales: {
                        x: { stacked: false }, // Hiển thị các cột riêng biệt
                        y: { stacked: false, beginAtZero: true },
                    },
                }
            });
            chartRef.current.chart = newChart;
        }
    }, [labels, consultationData, revenueData]);


    return (
        <div className='h-full flex justify-between'>
            <div className='w-[70%] flex flex-col gap-1'>
                <div className='flex items-center'>
                    <img src='/revenue.png' className='w-[50px] translate-y-[-5px]' />
                    <span className='text-[#292929] text-[15px] font-medium'>Tổng doanh thu của tất cả bác sĩ: {formatMoney(allTopDoctor.reduce((total, item) => total += item.totalPrice, 0))}đ</span>
                </div>
                <div className='relative w-[100%] flex flex-col'>
                    <canvas ref={chartRef} />
                </div>
                <div style={{}} className='relative px-4 pb-2 rounded-lg h-[160px] w-[100%] flex flex-col'>
                    <div className='flex gap-2'>
                        <span className='text-[#292929] text-[15px] font-medium'>Lưu ý:</span>
                        <div className='flex flex-col gap-1'>
                            <span className='text-[#3e3e3e] text-[14px] font-medium'>Các thông tin về doanh thu đang hiển thị phụ thuộc vào thời gian lựa chọn</span>
                            <span className='text-[#3e3e3e] text-[14px] font-medium'>Doanh thu của bác sĩ là 70% doanh thu từ các cuộc hẹn khám</span>
                            <span className='text-[#3e3e3e] text-[14px] font-medium'>Tổng doanh thu là tổng tất cả doanh thu của các bác sĩ</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-[29%] h-[80%] flex flex-col border-l-[1px] border-[#d9d9d9] px-3 text-[#2b2b2b] gap-1'>
                <span className='text-[15px] font-semibold'>Doanh thu theo từng bác sĩ</span>
                <div className='h-[100%] overflow-auto w-full flex flex-col gap-2'>
                    {allTopDoctor.map((item, index) => (
                        <div onClick={() => setCurrentDoctor(item)} key={index} className='w-full relative cursor-pointer shadow-sm bg-[#f8f8f89e] p-2 rounded-md flex items-center relative gap-2'>
                            <div className='w-[45px] h-[45px] rounded-full overflow-hidden border-[2px] flex justify-center bg-[white] items-center border-[#4edcc1]'>
                                <img src={item.doctor.image} className='h-[45px] translate-y-[5px]' />
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-[13px] font-semibold'>BS. {item.doctor.fullName}</span>
                                <span className='text-[12px]'>Doanh thu: {formatMoney(item.totalPrice) === '' ? '0đ' : `${formatMoney(item.totalPrice)}đ`}</span>
                            </div>
                            {doctorSuggests.map(item => item.doctor_record_id).includes(item.doctor._id) && (
                                <div className='absolute right-1 top-[2px]'>
                                    <i className='bx bxs-star text-[#e6e634]'></i>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ChartRevenue