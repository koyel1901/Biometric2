import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { api } from '../../services/api';

const ReportAtt = () => {

  const today = new Date().toISOString().split("T")[0];

  const [fromDate,setFromDate] = useState(today);
  const [toDate,setToDate] = useState(today);

  const [summary,setSummary] = useState([]);

  const [loading,setLoading] = useState(false);



  // helper to get date list
  const getDateRange = (start,end) => {

    const dates = [];

    let current = new Date(start);

    const last = new Date(end);



    while(current <= last){

      dates.push(

        new Date(current)
        .toISOString()
        .split("T")[0]

      );



      current.setDate(

        current.getDate()+1

      );

    }



    return dates;

  };





  const generateReport = async () => {

    setLoading(true);

    try{

      const employees = await api.get(

        "/api/org-admin/employees"

      );



      const dates = getDateRange(

        fromDate,
        toDate

      );



      // structure

      const reportMap = {};



      employees.forEach(emp => {

        reportMap[emp.id] = {

          name: emp.name,

          present: 0,

          late: 0,

          absent: 0

        };

      });




      // fetch attendance for each date

      for(const d of dates){

        const records = await api.get(

          `/api/org-admin/attendance/date/${d}`

        );



        const presentMap = {};



        records.forEach(r => {

          presentMap[r.employee_id] = r.status;

        });



        // mark attendance

        employees.forEach(emp => {



          const status = presentMap[emp.id];



          if(

            status === "present" ||

            status === "on_time"

          ){

            reportMap[emp.id].present++;

          }



          else if(

            status === "late"

          ){

            reportMap[emp.id].late++;

          }



          else{

            reportMap[emp.id].absent++;

          }



        });

      }




      // calculate percentage

      const result = Object.values(reportMap)

      .map(r => {



        const totalDays =

          r.present +

          r.late +

          r.absent;



        const percent =

          totalDays > 0

          ?

          ((r.present + r.late) /

            totalDays * 100)

            .toFixed(1)

          :

          0;



        return {

          ...r,

          percent: percent + "%"

        };

      });



      setSummary(result);

    }

    catch(err){

      console.log("attendance report error",err);

    }



    setLoading(false);

  };





  useEffect(()=>{

    generateReport();

  },[]);





  const downloadcsv = () => {

    let csv =

    "Employee,Present,Late,Absent,Attendance%\n";



    summary.forEach(s => {

      csv +=

      `${s.name},${s.present},${s.late},${s.absent},${s.percent}\n`;

    });



    const blob = new Blob(

      [csv],

      {type:"text/csv"}

    );



    const link = document.createElement("a");



    link.href =

      URL.createObjectURL(blob);



    link.download =

      "attendance_report.csv";



    link.click();

  };





  return (

    <DashboardLayout

      title="Attendance Report"

      role="orgadmin"

      label="Department Admin"

      abbr="DA"

      color="#00d4aa"

      bgColor="rgba(0,212,170,0.15)"

    >



      <div

        className="card-box"

        style={{

          maxWidth:'500px',

          marginBottom:'1.5rem'

        }}

      >

        <h4>

          Generate Attendance Report

        </h4>



        <div

          className="form-grid"

          style={{marginTop:'1rem'}}

        >

          <div className="form-group">

            <label className="form-label">

              From Date

            </label>



            <input

              className="form-input"

              type="date"

              value={fromDate}

              onChange={

                e => setFromDate(

                  e.target.value

                )

              }

            />

          </div>



          <div className="form-group">

            <label className="form-label">

              To Date

            </label>



            <input

              className="form-input"

              type="date"

              value={toDate}

              onChange={

                e => setToDate(

                  e.target.value

                )

              }

            />

          </div>

        </div>



        <div style={{

          marginTop:'1rem',

          display:'flex',

          gap:'1rem'

        }}>



          <button

            className="btn btn-teal"

            onClick={generateReport}

          >

            Generate

          </button>



          <button

            className="btn btn-ghost"

            onClick={downloadcsv}

          >

            Download Pdf

          </button>

        </div>

      </div>





      <div className="table-wrap">

        <div className="table-header">

          <span className="table-title">

            Attendance Summary

          </span>

        </div>



        {loading ? (

          <div>Loading...</div>

        ) : (



        <table>

          <thead>

            <tr>

              <th>Name</th>

              <th>Present</th>

              <th>Late</th>

              <th>Absent</th>

              <th>%</th>

            </tr>

          </thead>



          <tbody>



            {summary.length===0 ? (

              <tr>

                <td colSpan="5">

                  No data found

                </td>

              </tr>

            ) : (



              summary.map((s,i)=>(

                <tr key={i}>



                  <td>

                    {s.name}

                  </td>



                  <td>

                    {s.present}

                  </td>



                  <td>

                    {s.late}

                  </td>



                  <td>

                    {s.absent}

                  </td>



                  <td style={{

                    fontFamily:'var(--mono)'

                  }}>

                    {s.percent}

                  </td>



                </tr>

              ))



            )}

          </tbody>

        </table>

        )}

      </div>

    </DashboardLayout>

  );

};



export default ReportAtt;