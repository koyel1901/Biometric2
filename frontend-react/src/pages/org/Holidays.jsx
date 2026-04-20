import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { api } from '../../services/api';

const Holidays = () => {

  const [holidays,setHolidays] = useState([]);

  const [loading,setLoading] = useState(true);

  const [error,setError] = useState("");



  useEffect(()=>{

    fetchHolidays();

  },[]);



  const fetchHolidays = async () => {

    try{

      const data = await api.get(

        "/api/org-admin/holidays"

      );

      setHolidays(data);

    }

    catch(err){

      console.log(err);

      setError("Failed to load holidays");

    }



    setLoading(false);

  };



  const formatDate = (dateStr) => {

    if(!dateStr) return "-";



    const d = new Date(dateStr);



    return d.toLocaleDateString(

      "en-IN",

      {

        day:"2-digit",

        month:"short",

        year:"numeric"

      }

    );

  };



  const getDay = (dateStr) => {

    if(!dateStr) return "-";



    return new Date(dateStr)

    .toLocaleDateString(

      "en-IN",

      {

        weekday:"long"

      }

    );

  };



  return (

    <DashboardLayout

      title="Holidays"

      role="orgadmin"

      label="Department Admin"

      abbr="DA"

      color="#00d4aa"

      bgColor="rgba(0,212,170,0.15)"

    >



      <div className="table-wrap">

        <div className="table-header">

          <span className="table-title">

            Organization Holidays

          </span>

        </div>



        {loading ? (

          <div>Loading...</div>

        ) : error ? (

          <div style={{color:"red"}}>

            {error}

          </div>

        ) : (



        <table>



          <thead>

            <tr>

              <th>Holiday</th>

              <th>Date</th>

              <th>Day</th>

              <th>Description</th>

            </tr>

          </thead>



          <tbody>



            {holidays.length === 0 ? (

              <tr>

                <td colSpan="4">

                  No holidays found

                </td>

              </tr>

            ) : (



              holidays.map(h=>(

                <tr key={

                  h.id ||

                  h.holiday_id

                }>



                  <td>

                    {h.name ||

                     h.holiday_name}

                  </td>



                  <td style={{

                    fontFamily:'var(--mono)',

                    fontSize:'0.8rem'

                  }}>

                    {formatDate(

                      h.date ||

                      h.holiday_date

                    )}

                  </td>



                  <td style={{

                    fontFamily:'var(--mono)',

                    fontSize:'0.8rem'

                  }}>

                    {getDay(

                      h.date ||

                      h.holiday_date

                    )}

                  </td>



                  <td>

                    {h.description || "-"}

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



export default Holidays;