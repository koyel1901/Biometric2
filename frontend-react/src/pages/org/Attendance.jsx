import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Badge from '../../components/Badge';
import { api } from '../../services/api';

const Attendance = () => {

  const todayDate = new Date().toISOString().split('T')[0];

  const [attendance,setAttendance] = useState([]);
  const [loading,setLoading] = useState(true);
  const [search,setSearch] = useState("");
  const [statusFilter,setStatusFilter] = useState("all");
  const [selectedDate,setSelectedDate] = useState(todayDate);



  // fetch attendance

  const fetchAttendance = async (date) => {

  try{

    const data = await api.get(

      `/api/org-admin/attendance/date/${date}`

    );

    setAttendance(data);

  }

  catch(err){

    console.log("attendance error",err);

  }

  setLoading(false);

};


  useEffect(()=>{

    fetchAttendance(selectedDate);

  },[selectedDate]);




  // calculate hours

  const calculateHours = (inTime,outTime) => {

    if(!inTime || !outTime) return "--";

    const diff = new Date(outTime) - new Date(inTime);

    const hrs = Math.floor(diff/1000/60/60);

    const mins = Math.floor((diff/1000/60)%60);

    return `${hrs}h ${mins}m`;

  };




  // filtering

  const filteredData = attendance.filter(a=>{

    const matchesSearch = a.name

      ?.toLowerCase()

      .includes(search.toLowerCase());

    const matchesStatus =

      statusFilter==="all"

      ||

      a.status===statusFilter;

    return matchesSearch && matchesStatus;

  });




  return (

    <DashboardLayout

      title="Attendance List"

      role="orgadmin"

      label="Department Admin"

      abbr="DA"

      color="#00d4aa"

      bgColor="rgba(0,212,170,0.15)"

    >



      <div className="table-wrap">

        <div className="table-header">

          <span className="table-title">

            Attendance List

          </span>



          <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>



            <input

              className="tb-search"

              placeholder="Search employee..."

              value={search}

              onChange={(e)=>setSearch(e.target.value)}

              style={{width:'160px'}}

            />



            <select

              className="form-select"

              value={statusFilter}

              onChange={(e)=>setStatusFilter(e.target.value)}

              style={{

                width:'110px',

                padding:'0.4rem 0.6rem',

                fontSize:'0.8rem'

              }}

            >

              <option value="all">

                All Status

              </option>

              <option value="present">

                Present

              </option>

              <option value="absent">

                Absent

              </option>

              <option value="late">

                Late

              </option>

            </select>



            <input

              type="date"

              className="form-input"

              value={selectedDate}

              onChange={(e)=>setSelectedDate(e.target.value)}

              style={{

                width:'130px',

                padding:'0.4rem',

                fontSize:'0.8rem',

                background:'var(--bg2)',

                border:'1px solid var(--border)',

                color:'var(--text)',

                borderRadius:'6px'

              }}

            />



          </div>

        </div>



        {loading ? (

          <div>Loading...</div>

        ) : (



        <table>

          <thead>

            <tr>

              <th>Employee</th>

              <th>Date</th>

              <th>Check-in</th>

              <th>Check-out</th>

              <th>Hours</th>

              <th>Status</th>

            </tr>

          </thead>



          <tbody>



            {filteredData.map(a=>(

              <tr key={a.id}>



                <td>

                  {a.name}

                </td>



                <td style={{fontFamily:'var(--mono)',fontSize:'0.8rem'}}>

                  {selectedDate}

                </td>



                <td style={{fontFamily:'var(--mono)',fontSize:'0.8rem'}}>

                  {a.check_in ?

                    new Date(a.check_in).toLocaleTimeString([],{

                      hour:'2-digit',

                      minute:'2-digit'

                    })

                    :

                    "--"

                  }

                </td>



                <td style={{fontFamily:'var(--mono)',fontSize:'0.8rem'}}>

                  {a.check_out ?

                    new Date(a.check_out).toLocaleTimeString([],{

                      hour:'2-digit',

                      minute:'2-digit'

                    })

                    :

                    "--"

                  }

                </td>



                <td style={{fontFamily:'var(--mono)',fontSize:'0.8rem'}}>

                  {calculateHours(a.check_in,a.check_out)}

                </td>



                <td>

                  <Badge type={

                    a.status==="present"

                    && a.punctuality==="late"

                    ? "late"

                    : a.status

                  }>

                    {

                      a.status==="present"

                      && a.punctuality==="late"

                      ? "late"

                      : a.status

                    }

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



export default Attendance;