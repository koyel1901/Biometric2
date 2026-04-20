import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Badge from '../../components/Badge';
import { api } from '../../services/api';

const Leaves = () => {

  const [requests,setRequests] = useState([]);
  const [loading,setLoading] = useState(true);
  const [filter,setFilter] = useState("all");



  // fetch leaves

  const fetchLeaves = async () => {

    try{

     const data = await api.get("/api/org-admin/leaves");

    setRequests(data);

    }

    catch(err){

      console.log("leave fetch error",err);

    }

    setLoading(false);

  };



  useEffect(()=>{

    fetchLeaves();

  },[]);




  // approve leave

  const approveLeave = async (id) => {

    try{

      await api.patch(

  `/api/org-admin/leaves/${id}/approve`

);

      // reload table after update
      fetchLeaves();

    }

    catch(err){

      console.log("approve error",err);

    }

  };




  // filter

  const filteredRequests = requests.filter(r=>{

    if(filter==="all") return true;

    return r.status===filter;

  });




  return (

    <DashboardLayout

      title="Leave Requests"

      role="orgadmin"

      label="Department Admin"

      abbr="DA"

      color="#00d4aa"

      bgColor="rgba(0,212,170,0.15)"

    >

      <div className="table-wrap">

        <div className="table-header">

          <span className="table-title">

            Leave Requests

          </span>



          <select

            className="form-select"

            value={filter}

            onChange={(e)=>setFilter(e.target.value)}

            style={{

              width:'120px',

              padding:'0.4rem 0.8rem',

              fontSize:'0.82rem'

            }}

          >

            <option value="all">All</option>

            <option value="pending">Pending</option>

            <option value="approved">Approved</option>

            <option value="rejected">Rejected</option>

          </select>



        </div>



        {loading ? (

          <div>Loading...</div>

        ) : (



        <table>

          <thead>

            <tr>

              <th>Employee</th>

              <th>Type</th>

              <th>From</th>

              <th>To</th>

              <th>Reason</th>

              <th>Status</th>

              <th>Actions</th>

            </tr>

          </thead>



          <tbody>



            {filteredRequests.map((r)=>(

              <tr key={r.leave_id}>



                <td>

                  {r.employee_name}

                </td>



                <td>

                  {r.leave_type}

                </td>



                <td style={{fontFamily:'var(--mono)',fontSize:'0.8rem'}}>

                  {new Date(r.start_date).toLocaleDateString()}

                </td>



                <td style={{fontFamily:'var(--mono)',fontSize:'0.8rem'}}>

                  {new Date(r.end_date).toLocaleDateString()}

                </td>



                <td>

                  {r.reason}

                </td>



                <td>

                  <Badge type={r.status}>

                    {r.status}

                  </Badge>

                </td>



                <td style={{display:'flex',gap:'6px',padding:'0.85rem 0'}}>



                  {r.status==="pending" ? (

                    <>

                      <button

                        className="btn btn-teal"

                        style={{padding:'3px 10px',fontSize:'0.75rem'}}

                        onClick={()=>approveLeave(r.leave_id)}

                      >

                        Approve

                      </button>



                      <button

                        className="btn btn-red"

                        style={{padding:'3px 10px',fontSize:'0.75rem'}}

                        disabled

                      >

                        Reject

                      </button>

                    </>

                  ) : (

                    "-"

                  )}



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



export default Leaves;