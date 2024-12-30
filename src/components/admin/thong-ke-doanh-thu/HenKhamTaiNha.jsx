import { api, TypeHTTP } from "@/utils/api";
import {
  compare2Date,
  compareDate1GetterThanDate2,
  compareTimeDate1GreaterThanDate2,
  convertDateToDayMonthYearObject,
  convertDateToDayMonthYearTimeObject,
  convertDateToDayMonthYearVietNam,
  getFirstAndLastDayOfMonth,
  getFirstAndLastDayOfWeek,
  isALargerWithin10Minutes,
  isALargerWithin60Minutes,
  sortByAppointmentDate,
} from "@/utils/date";
import { formatMoney, returnNumber } from "@/utils/others";
import { Chart } from "chart.js/auto";
import Link from "next/link";
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const HenKhamTaiNha = ({ month }) => {
  const [appointmentHomes, setAppointmentHomes] = useState(
    []
  );
  const [loading, setLoading] = useState(false);
  const [revenueToday, setRevenueToday] = useState(0);
  const [revenueYesterday, setRevenueYesterday] = useState(0);
  const [revenueWeek, setRevenueWeek] = useState(0);
  const [revenueMonth, setRevenueMonth] = useState(0);
  const [doctorRecords, setDoctorRecords] = useState([])

  useEffect(() => {
    if (month !== '') {
      const firstDay = convertDateToDayMonthYearObject(getFirstAndLastDayOfMonth(month).firstDay)
      const lastDay = convertDateToDayMonthYearObject(getFirstAndLastDayOfMonth(month).lastDay)
      setLoading(true)
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
            return (compareDate1GetterThanDate2(item.appointment_date, firstDay) === true &&
              compareDate1GetterThanDate2(lastDay, item.appointment_date)
            )
          })
          setAppointmentHomes(app)
          setLoading(false)
        });
    }
  }, [month])

  useEffect(() => {
    api({
      type: TypeHTTP.GET,
      path: "/doctorRecords/getAll",
      sendToken: false,
    }).then((res) => setDoctorRecords(res));
  }, []);

  useEffect(() => {
    const today = convertDateToDayMonthYearObject(new Date().toISOString());
    const yesterday = convertDateToDayMonthYearObject(new Date(new Date().setDate(new Date().getDate() - 1)).toISOString());
    const { firstDay, lastDay } = getFirstAndLastDayOfWeek()
    setRevenueToday(appointmentHomes.filter(item => compare2Date(item.appointment_date, today)).reduce((total, item) => total += item.price_list.price * 0.3, 0))
    setRevenueYesterday(appointmentHomes.filter(item => compare2Date(item.appointment_date, yesterday)).reduce((total, item) => total += item.price_list.price * 0.3, 0))
    setRevenueMonth(appointmentHomes.reduce((total, item) => total += item.price_list.price * 0.3, 0))
    setRevenueWeek(appointmentHomes.filter(item => compareDate1GetterThanDate2(item.appointment_date, convertDateToDayMonthYearObject(firstDay)) && compareDate1GetterThanDate2(convertDateToDayMonthYearObject(lastDay), item.appointment_date)).reduce((total, item) => total += item.price_list.price * 0.3, 0))
  }, [appointmentHomes])

  return (
    <>
      <div className="grid grid-cols-4 gap-4 mt-2">
        <div
          className="h-[120px] gap-2 justify-center p-4 text-[white] rounded-lg flex flex-col"
          style={{
            backgroundImage: "url(/Flare.jpg)",
            backgroundSize: "cover",
          }}
        >
          <div className="flex items-end gap-2">
            <i className="text-[40px] bx bx-dollar-circle"></i>
            <span className="text-[25px] font-semibold">
              {formatMoney(revenueToday) === '' ? 0 : formatMoney(revenueToday.toFixed(0))}đ
            </span>
          </div>
          <span className="font-medium text-[15px]">
            Doanh thu hôm nay
          </span>
        </div>
        <div
          className="h-[120px] gap-2 justify-center p-4 text-[white] rounded-lg flex flex-col"
          style={{
            backgroundImage: "url(/Quepal.jpg)",
            backgroundSize: "cover",
          }}
        >
          <div className="flex items-end gap-2">
            <i className="text-[30px] translate-y-[-5px] fa-regular fa-hourglass"></i>
            <span className="text-[25px] font-semibold">
              {formatMoney(revenueYesterday) === '' ? 0 : formatMoney(revenueYesterday.toFixed(0))}đ
            </span>
          </div>
          <span className="font-medium text-[15px]">
            Doanh thu hôm qua
          </span>
        </div>
        <div
          className="h-[120px] gap-2 justify-center p-4 text-[white] rounded-lg flex flex-col"
          style={{
            backgroundImage: "url(/SinCityRed.jpg)",
            backgroundSize: "cover",
          }}
        >
          <div className="flex items-end gap-2">
            <i className="text-[40px] bx bx-line-chart"></i>
            <span className="text-[25px] font-semibold">
              {formatMoney(revenueWeek) === '' ? 0 : formatMoney(revenueWeek.toFixed(0))}đ
            </span>
          </div>
          <span className="font-medium text-[15px]">
            Doanh thu theo tuần
          </span>
        </div>
        <div
          className="h-[120px] gap-2 justify-center p-4 text-[white] rounded-lg flex flex-col"
          style={{
            backgroundImage: "url(/EndlessRiver.jpg)",
            backgroundSize: "cover",
          }}
        >
          <div className="flex items-end gap-2">
            <i className="text-[40px] bx bx-calendar-check"></i>
            <span className="text-[25px] font-semibold">
              {formatMoney(revenueMonth) === '' ? 0 : formatMoney(revenueMonth.toFixed(0))}đ
            </span>
          </div>
          <span className="font-medium text-[15px]">
            Doanh thu theo tháng
          </span>
        </div>
      </div>
      <div className="w-full max-h-[500px] mt-6 overflow-y-auto relative">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="sticky top-0 left-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th
                scope="col"
                className="w-[5%] py-3 text-center"
              >
                #
              </th>
              <th scope="col" className="w-[15%] py-3">
                Bác sĩ
              </th>
              <th scope="col" className="w-[25%] py-3">
                Trạng thái
              </th>
              <th scope="col" className="w-[20%] py-3">
                Thời gian
              </th>
              <th scope="col" className="w-[40%] py-3 text-center">
                Tổng tiền
              </th>
            </tr>
          </thead>
          <tbody className=" w-[full] bg-black font-medium">
            {!loading &&
              appointmentHomes.map((appointment, index) => (
                <tr
                  key={index}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <td
                    scope="row"
                    className="px-6 py-4 text-center font-medium"
                  >
                    {index + 1}
                  </td>
                  <td className="py-4 text-[15px]">
                    {doctorRecords.filter(item => item._id === appointment.doctor_record_id)[0].doctor.fullName}
                  </td>
                  <td
                    style={{
                      color: "blue",
                    }}
                    className="py-4"
                  >
                    {appointment.status.message}
                  </td>
                  <td className="py-4">
                    {`${convertDateToDayMonthYearVietNam(
                      appointment.appointment_date
                    )}`}
                  </td>
                  <td className="py-4 text-center">{formatMoney(appointment.price_list.price * 0.3)}đ</td>
                </tr>
              ))}
          </tbody>
        </table>
        {!loading && appointmentHomes.length === 0 && (
          <div className="w-full flex items-center justify-center my-10 text-[18px] font-medium">
            Bác sĩ chưa có doanh thu nào
          </div>
        )}
        {loading && (
          <div className="w-full flex items-center justify-center my-10 text-[18px] font-medium">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-[black]"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.3238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.3766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        )}
      </div>
    </>
  );
};

export default HenKhamTaiNha;
