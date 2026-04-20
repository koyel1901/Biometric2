import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { TrendChart } from '../../components/Charts';
import { api } from '../../services/api';

const OrgDash = () => {

  const [dashboardData,setDashboardData] = useState(null);

  const [trendData,setTrendData] = useState([]);

  const [todayLeaves,setTodayLeaves] = useState([]);

  const [holidays,setHolidays] = useState([]);

  const [loading,setLoading] = useState(true);

  const [error,setError] = useState("");



  useEffect(()=>{

    const fetchDashboard = async () => {

      try{

        const token = localStorage.getItem("token");

        if(!token){

          setError("Please login again");

          setLoading(false);

          return;

        }



        // dashboard stats

        const dash = await api.get(

          "/api/org-admin/dashboard"

        );

        setDashboardData(dash);




        // upcoming holidays

        const holidayData = await api.get(

          "/api/org-admin/holidays/upcoming"

        );

        setHolidays(holidayData);




        // leaves

        const leavesData = await api.get(

          "/api/org-admin/leaves"

        );



        const today = new Date()

          .toISOString()

          .split("T")[0];



        const todaysLeave = leavesData.filter(l=>

          l.start_date <= today &&

          l.end_date >= today &&

          l.status==="approved"

        );



        setTodayLeaves(todaysLeave);




        // attendance trend last 7 days

        const last7days = [];



        const todayDate = new Date();



        for(let i=6;i>=0;i--){

          const d = new Date();

          d.setDate(todayDate.getDate()-i);



          const formatted = d

            .toISOString()

            .split("T")[0];



          const res = await api.get(

            `/api/org-admin/attendance/date/${formatted}`

          );



          const presentCount = res.filter(

            a => a.status==="present"

          ).length;



          last7days.push(presentCount);

        }



        setTrendData(last7days);

      }

      catch(err){

        console.log(err);

        setError("Failed to load dashboard");

      }



      setLoading(false);

    };



    fetchDashboard();



  },[]);





  return (

    <DashboardLayout

      title="Dashboard"

      role="orgadmin"

      label="Department Admin"

      abbr="DA"

      color="#00d4aa"

      bgColor="rgba(0,212,170,0.15)"

    >



      {loading && <div>Loading...</div>}



      {error && <div style={{color:"red"}}>{error}</div>}



      {dashboardData && (

      <>



      <div className="stats-grid">



        <div className="stat-card teal">

          <div className="stat-label">

            Total Employees

          </div>

          <div className="stat-value">

            {dashboardData.employees.total}

          </div>

        </div>





        <div className="stat-card green">

          <div className="stat-label">

            Present Today

          </div>



          <div className="stat-value">

            {dashboardData.attendance_today.present}

          </div>



          <div className="stat-sub">

            {dashboardData.employees.total>0 ?

              Math.round(

                (dashboardData.attendance_today.present /

                dashboardData.employees.total)*100

              )

              :

              0

            }%

          </div>

        </div>





        <div className="stat-card red">

          <div className="stat-label">

            Absent Today

          </div>



          <div className="stat-value">

            {dashboardData.attendance_today.absent}

          </div>

        </div>





        <div className="stat-card amber">

          <div className="stat-label">

            Late Today

          </div>



          <div className="stat-value">

            {dashboardData.attendance_today.late}

          </div>

        </div>





        <div className="stat-card blue">

          <div className="stat-label">

            On Leave

          </div>



          <div className="stat-value">

            {dashboardData.pending_leaves}

          </div>

        </div>





        <div className="stat-card purple">

          <div className="stat-label">

            Active Employees

          </div>



          <div className="stat-value">

            {dashboardData.employees.active}

          </div>

        </div>



      </div>





      {/* graph */}

      <div className="card-box">



        <h4>

          Attendance trend (last 7 days)

        </h4>



        <TrendChart

          labels={['Mon','Tue','Wed','Thu','Fri','Sat','Sun']}

          vals={trendData}

          color="#00d4aa"

        />



      </div>





      <div className="two-col">



        {/* leaves */}

        <div className="card-box">



          <h4>

            Employees on leave today

          </h4>



          <table style={{width:'100%'}}>



            <thead>

              <tr>

                <th>Name</th>

                <th>Return</th>

              </tr>

            </thead>



            <tbody>



              {todayLeaves.length===0 ? (

                <tr>

                  <td>No leave today</td>

                  <td>-</td>

                </tr>

              ) : (



                todayLeaves.map(l=>(

                  <tr key={l.leave_id}>



                    <td>

                      {l.employee_name}

                    </td>



                    <td>

                      {new Date(l.end_date)

                        .toLocaleDateString()}

                    </td>



                  </tr>

                ))



              )}



            </tbody>



          </table>



        </div>





        {/* holidays */}

        <div className="card-box">



          <h4>

            Upcoming holidays

          </h4>



          <table style={{width:'100%'}}>



            <thead>

              <tr>

                <th>Holiday</th>

                <th>Date</th>

              </tr>

            </thead>



            <tbody>



              {holidays.length===0 ? (

                <tr>

                  <td>No holidays</td>

                  <td>-</td>

                </tr>

              ) : (



                holidays.map(h=>(

                  <tr key={h.id}>



                    <td>

                      {h.name}

                    </td>



                    <td>

                      {new Date(h.holiday_date).toLocaleDateString()}

                    </td>



                  </tr>

                ))



              )}



            </tbody>



          </table>



        </div>



      </div>



      </>

      )}



    </DashboardLayout>

  );

};



export default OrgDash;