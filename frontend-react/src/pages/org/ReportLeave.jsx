import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Badge from '../../components/Badge';
import { api } from '../../services/api';

const ReportLeave = () => {

  const today = new Date().toISOString().split("T")[0];

  const [fromDate,setFromDate] = useState(today);
  const [toDate,setToDate] = useState(today);

  const [stats,setStats] = useState([]);

  const [loading,setLoading] = useState(false);



  const generateReport = async () => {

  setLoading(true);

  try{

    const employees = await api.get(
      "/api/org-admin/employees"
    );

    const leaves = await api.get(
      "/api/org-admin/leaves"
    );



    const reportMap = {};



    // initialize employees
    employees.forEach(emp => {

      reportMap[emp.name] = {

        name: emp.name,

        sick: 0,

        casual: 0,

        total: 0,

        pending: 0

      };

    });



    // process leaves
    leaves.forEach(l => {

      const leaveStart =
        l.start_date.split("T")[0];

      const leaveEnd =
        l.end_date.split("T")[0];



      const overlaps =
        leaveStart <= toDate &&
        leaveEnd >= fromDate;



      if(!overlaps) return;



      const empName = l.employee_name;



      if(!reportMap[empName]){

        reportMap[empName] = {

          name: empName,

          sick: 0,

          casual: 0,

          total: 0,

          pending: 0

        };

      }



      const days = 1;



      if(

        l.leave_type?.toLowerCase() === "sick"

      ){

        reportMap[empName].sick += days;

      }

      else{

        reportMap[empName].casual += days;

      }



      reportMap[empName].total += days;



      if(l.status === "pending"){

        reportMap[empName].pending += days;

      }

    });



    // add status safely
    const result = Object.values(reportMap).map(r => ({

      ...r,

      status:

        r.total === 0

        ? "No leaves"

        : r.pending > 0

        ? `${r.pending} pending`

        : "approved"

    }));



    setStats(result);

  }

  catch(err){

    console.log("leave report error", err);

  }



  setLoading(false);

};



  useEffect(()=>{

    generateReport();

  },[]);



  const downloadcsv = () => {

    let csv =

    "Employee,Sick,Casual,Total,Status\n";



    stats.forEach(s => {

      csv +=

      `${s.name},${s.sick},${s.casual},${s.total},${s.status}\n`;

    });



    const blob = new Blob(

      [csv],

      {type:"text/csv"}

    );



    const link = document.createElement("a");



    link.href =

      URL.createObjectURL(blob);



    link.download =

      "leave_report.csv";



    link.click();

  };



  return (

    <DashboardLayout

      title="Leave Report"

      role="orgadmin"

      label="Department Admin"

      abbr="DA"

      color="#00d4aa"

      bgColor="rgba(0,212,170,0.15)"

    >



      <div className="card-box"

        style={{maxWidth:'500px',marginBottom:'1.5rem'}}

      >

        <h4>Generate Leave Report</h4>



        <div className="form-grid"

          style={{marginTop:'1rem'}}

        >

          <div className="form-group">

            <label>From Date</label>

            <input

              type="date"

              value={fromDate}

              onChange={e=>setFromDate(e.target.value)}

              className="form-input"

            />

          </div>



          <div className="form-group">

            <label>To Date</label>

            <input

              type="date"

              value={toDate}

              onChange={e=>setToDate(e.target.value)}

              className="form-input"

            />

          </div>

        </div>



        <div style={{marginTop:'1rem'}}>

          <button

            className="btn btn-teal"

            onClick={generateReport}

          >

            Generate

          </button>



          <button

            className="btn btn-ghost"

            onClick={downloadcsv}

            style={{marginLeft:'10px'}}

          >

            Download Pdf

          </button>

        </div>

      </div>



      <div className="table-wrap">

        <div className="table-header">

          <span className="table-title">

            Leave Statistics

          </span>

        </div>



        {loading ? (

          <div>Loading...</div>

        ) : (

        <table>

          <thead>

            <tr>

              <th>Name</th>

              <th>Sick</th>

              <th>Casual</th>

              <th>Total</th>

              <th>Status</th>

            </tr>

          </thead>



          <tbody>

            {stats.map((s,i)=>(

              <tr key={i}>

                <td>{s.name}</td>

                <td>{s.sick}</td>

                <td>{s.casual}</td>

                <td>{s.total}</td>



                <td>

                  <Badge

                    type={

                      s.status.includes("pending")

                      ? "pending"

                      : s.status==="No leaves"

                      ? "inactive"

                      : "approved"

                    }

                  >

                    {s.status}

                  </Badge>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        )}

      </div>

    </DashboardLayout>

  );

};

export default ReportLeave;