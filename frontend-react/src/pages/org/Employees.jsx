import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Badge from '../../components/Badge';
import { api } from '../../services/api';

const Employees = () => {

  const [view,setView] = useState('list');

  const [employees,setEmployees] = useState([]);

  const [loading,setLoading] = useState(true);

  const [newEmployee,setNewEmployee] = useState({

    name:"",

    email:"",

    phone:"",

    finger_id:""

  });



  // fetch employees

  const fetchEmployees = async () => {

    try{

      const data = await api.get("/api/org-admin/employees");

setEmployees(data);j

    }

    catch(err){

      console.log("employee fetch error",err);

    }

    setLoading(false);

  };



  useEffect(()=>{

    fetchEmployees();

  },[]);




  // add employee

  const registerEmployee = async () => {

    try{

      const data = await api.post(
  "/api/org-admin/employees",
  {
    name:newEmployee.name,
    email:newEmployee.email,
    phone:newEmployee.phone
  }
);



      // assign fingerprint

      if(newEmployee.finger_id){

        await api.patch(
  `/api/org-admin/employees/${data.id}/assign-fingerprint`,
  {
    finger_id:newEmployee.finger_id
  }
);

      }



      setView("list");

      fetchEmployees();

    }

    catch(err){

      console.log("register error",err);

    }

  };




  // update employee

  const updateEmployee = async (id,updatedData) => {

    const token = localStorage.getItem("token");
await api.put(
  `/api/org-admin/employees/${id}`,
  updatedData
);

    fetchEmployees();

  };




  // delete employee

  const deleteEmployee = async (id) => {

    const token = localStorage.getItem("token");

    await api.delete(
  `/api/org-admin/employees/${id}`
);

    fetchEmployees();

  };




  return (

    <DashboardLayout

      title="All Employees"

      role="orgadmin"

      label="Department Admin"

      abbr="DA"

      color="#00d4aa"

      bgColor="rgba(0,212,170,0.15)"

    >



      {/* employee list */}

      {view==="list" && (

        <div>



          <div className="table-wrap">

            <div className="table-header">

              <span className="table-title">

                Employee Registry

              </span>



              <button

                className="btn btn-teal"

                onClick={()=>setView('add')}

              >

                + Add

              </button>



            </div>



            {loading ? (

              <div>Loading...</div>

            ) : (



            <table>

              <thead>

                <tr>

                  <th>Emp Code</th>

                  <th>Name</th>

                  <th>Fingerprint</th>

                  <th>Status</th>

                  <th>Actions</th>

                </tr>

              </thead>



              <tbody>



                {employees.map(emp=>(

                  <tr key={emp.id}>



                    <td style={{fontFamily:'var(--mono)'}}>

                      {emp.employee_code}

                    </td>



                    <td>

                      {emp.name}

                    </td>



                    <td style={{fontFamily:'var(--mono)'}}>

                      {emp.finger_id ?? "--"}

                    </td>



                    <td>

                      <Badge type={

                        emp.is_active ? "active" : "inactive"

                      }>

                        {emp.is_active ? "active" : "inactive"}

                      </Badge>

                    </td>



                    <td style={{display:'flex',gap:'6px'}}>



                      <button

                        className="btn btn-ghost"

                        onClick={()=>alert(JSON.stringify(emp,null,2))}

                      >

                        View

                      </button>



                      <button

                        className="btn btn-ghost"

                        onClick={()=>deleteEmployee(emp.id)}

                      >

                        Delete

                      </button>



                    </td>



                  </tr>

                ))}



              </tbody>

            </table>

            )}



          </div>



        </div>

      )}





      {/* add employee */}

      {view==="add" && (

        <div>



          <div style={{marginBottom:'1.5rem'}}>



            <button

              className="btn btn-ghost"

              onClick={()=>setView('list')}

              style={{display:'flex',gap:'6px'}}

            >

              <ArrowLeft size={18} />

              Back to Employees

            </button>



          </div>



          <div className="card-box" style={{maxWidth:'600px'}}>



            <h4>

              Add New Employee

            </h4>



            <div

              className="form-grid"

              style={{marginTop:'1rem'}}

            >



              <div className="form-group">

                <label className="form-label">

                  Full Name

                </label>



                <input

                  className="form-input"

                  value={newEmployee.name}

                  onChange={(e)=>

                    setNewEmployee({

                      ...newEmployee,

                      name:e.target.value

                    })

                  }

                />

              </div>



              <div className="form-group">

                <label className="form-label">

                  Email

                </label>



                <input

                  className="form-input"

                  value={newEmployee.email}

                  onChange={(e)=>

                    setNewEmployee({

                      ...newEmployee,

                      email:e.target.value

                    })

                  }

                />

              </div>



              <div className="form-group">

                <label className="form-label">

                  Phone

                </label>



                <input

                  className="form-input"

                  value={newEmployee.phone}

                  onChange={(e)=>

                    setNewEmployee({

                      ...newEmployee,

                      phone:e.target.value

                    })

                  }

                />

              </div>



              <div className="form-group">

                <label className="form-label">

                  Fingerprint ID

                </label>



                <input

                  className="form-input"

                  value={newEmployee.finger_id}

                  onChange={(e)=>

                    setNewEmployee({

                      ...newEmployee,

                      finger_id:e.target.value

                    })

                  }

                  placeholder="eg 45"

                />

              </div>



            </div>



            <div style={{marginTop:'1.5rem',display:'flex',gap:'1rem'}}>



              <button

                className="btn btn-teal"

                onClick={registerEmployee}

              >

                Register Employee

              </button>



              <button

                className="btn btn-ghost"

                onClick={()=>setView('list')}

              >

                Cancel

              </button>



            </div>



          </div>



        </div>

      )}



    </DashboardLayout>

  );

};



export default Employees;