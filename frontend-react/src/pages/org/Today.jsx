import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { api } from '../../services/api';

const Today = () => {

  const [view,setView] = useState('main');

  const [attendance,setAttendance] = useState([]);

  const [loading,setLoading] = useState(true);



  // fetch today's attendance

  useEffect(()=>{

    const fetchTodayAttendance = async () => {

      try{

        const data = await api.get(

  "/api/org-admin/attendance/today"

);

setAttendance(data);

      }

      catch(err){

        console.log("today attendance error",err);

      }

      setLoading(false);

    };

    fetchTodayAttendance();

  },[]);




  // calculations

  const presentEmployees = attendance.filter(

    a => a.status==="present"

  );



  const lateEmployees = attendance.filter(

    a => a.punctuality==="late"

  );



  const absentEmployees = attendance.filter(

    a => a.status==="absent"

  );



  return (

    <DashboardLayout

      title="Today Attendance"

      role="orgadmin"

      label="Department Admin"

      abbr="DA"

      color="#00d4aa"

      bgColor="rgba(0,212,170,0.15)"

    >



      {loading ? (

        <div>Loading...</div>

      ) : (



      <>



      {view === 'main' && (

        <div>



          <div

            style={{

              display:'flex',

              justifyContent:'space-between',

              alignItems:'center',

              marginBottom:'1.5rem'

            }}

          >

            <h3 style={{fontWeight:600}}>

              Daily Overview

            </h3>



            <button

              className="btn btn-teal"

              onClick={()=>setView('manual')}

            >

              Manual Entry +

            </button>



          </div>





          <div

            className="stats-grid"

            style={{marginBottom:'1.5rem'}}

          >



            <div className="stat-card green">

              <div className="stat-label">

                Present

              </div>



              <div className="stat-value">

                {presentEmployees.length}

              </div>

            </div>




            <div className="stat-card red">

              <div className="stat-label">

                Absent

              </div>



              <div className="stat-value">

                {absentEmployees.length}

              </div>

            </div>




            <div className="stat-card amber">

              <div className="stat-label">

                Late

              </div>



              <div className="stat-value">

                {lateEmployees.length}

              </div>

            </div>



          </div>





          <div className="card-box">

            <h4>Present employees</h4>



            <table style={{width:'100%'}}>



              <thead>

                <tr>

                  <th>Name</th>

                  <th>Check-in</th>

                </tr>

              </thead>



              <tbody>



                {presentEmployees.map(emp=>(

                  <tr key={emp.id}>



                    <td>

                      {emp.name}

                    </td>



                    <td style={{fontFamily:'var(--mono)',fontSize:'0.8rem'}}>

                      {emp.check_in ?

                        new Date(emp.check_in).toLocaleTimeString([],{

                          hour:'2-digit',

                          minute:'2-digit'

                        })

                        :

                        "--"

                      }

                    </td>



                  </tr>

                ))}



              </tbody>



            </table>

          </div>





          <div className="card-box">

            <h4>Late employees</h4>



            <table style={{width:'100%'}}>



              <thead>

                <tr>

                  <th>Name</th>

                  <th>Check-in</th>

                </tr>

              </thead>



              <tbody>



                {lateEmployees.map(emp=>(

                  <tr key={emp.id}>



                    <td>

                      {emp.name}

                    </td>



                    <td style={{fontFamily:'var(--mono)',fontSize:'0.8rem'}}>

                      {emp.check_in ?

                        new Date(emp.check_in).toLocaleTimeString([],{

                          hour:'2-digit',

                          minute:'2-digit'

                        })

                        :

                        "--"

                      }

                      <span

                        className="badge late"

                        style={{marginLeft:'6px'}}

                      >

                        late

                      </span>



                    </td>



                  </tr>

                ))}



              </tbody>



            </table>

          </div>



        </div>

      )}





      {view === 'manual' && (

        <div>



          <div style={{marginBottom:'1.5rem'}}>

            <button

              className="btn btn-ghost"

              onClick={()=>setView('main')}

              style={{

                display:'flex',

                alignItems:'center',

                gap:'6px'

              }}

            >

              <ArrowLeft size={18} />

              Back to Overview

            </button>

          </div>





          <div className="card-box" style={{maxWidth:'500px'}}>



            <h4>

              Manual Attendance Entry

            </h4>



            <div

              style={{

                marginTop:'1rem',

                display:'flex',

                flexDirection:'column',

                gap:'1rem'

              }}

            >



              <div className="form-group">

                <label className="form-label">

                  Employee

                </label>



                <select className="form-select">

                  {attendance.map(emp=>(

                    <option key={emp.id}>

                      {emp.name} ({emp.employee_code})

                    </option>

                  ))}

                </select>

              </div>



              <div className="form-group">

                <label className="form-label">

                  Date

                </label>



                <input

                  className="form-input"

                  type="date"

                />

              </div>



              <div className="form-group">

                <label className="form-label">

                  Time

                </label>



                <input

                  className="form-input"

                  type="time"

                />

              </div>



              <div className="form-group">

                <label className="form-label">

                  Record Type

                </label>



                <select className="form-select">

                  <option>IN</option>

                  <option>OUT</option>

                </select>

              </div>



              <div className="form-group">

                <label className="form-label">

                  Reason

                </label>



                <input

                  className="form-input"

                  placeholder="Machine issue etc"

                />

              </div>



              <div style={{display:'flex',gap:'1rem'}}>

                <button

                  className="btn btn-teal"

                  onClick={()=>setView('main')}

                >

                  Submit Entry

                </button>



                <button

                  className="btn btn-ghost"

                  onClick={()=>setView('main')}

                >

                  Cancel

                </button>

              </div>



            </div>



          </div>



        </div>

      )}



      </>



      )}



    </DashboardLayout>

  );

};

export default Today;