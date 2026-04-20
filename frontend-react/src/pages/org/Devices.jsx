import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Badge from '../../components/Badge';
import { api } from '../../services/api';

const Devices = () => {

  const [devices,setDevices] = useState([]);

  const [loading,setLoading] = useState(true);



  useEffect(()=>{

    const fetchDevices = async () => {

      try{

        // get device list

        const deviceList = await api.get(

          "/api/org-admin/devices"

        );



        // get status info

        const statusList = await api.get(

          "/api/org-admin/devices/status"

        );



        // merge device info + status

        const mergedDevices = deviceList.map(d=>{

          const statusInfo = statusList.find(

            s => s.device_id === d.id

          );



          return {

            id: d.id,

            name: d.name,

            loc: d.location,

            last_sync: statusInfo?.last_sync,

            status: statusInfo?.status || "offline"

          };

        });



        setDevices(mergedDevices);

      }

      catch(err){

        console.log("device fetch error",err);

      }



      setLoading(false);

    };



    fetchDevices();



  },[]);





  // helper to show time ago

  const formatLastSync = (time) => {

    if(!time) return "--";



    const diff =

      (new Date() - new Date(time)) / 1000 / 60;



    if(diff < 1) return "just now";

    if(diff < 60) return `${Math.floor(diff)} min ago`;

    if(diff < 1440) return `${Math.floor(diff/60)} hrs ago`;



    return new Date(time).toLocaleDateString();

  };





  return (

    <DashboardLayout

      title="Devices"

      role="orgadmin"

      label="Department Admin"

      abbr="DA"

      color="#00d4aa"

      bgColor="rgba(0,212,170,0.15)"

    >



      <div className="table-wrap">



        <div className="table-header">

          <span className="table-title">

            Biometric Devices

          </span>

        </div>



        {loading ? (

          <div>Loading...</div>

        ) : (



        <table>



          <thead>

            <tr>

              <th>Device ID</th>

              <th>Name</th>

              <th>Location</th>

              <th>Last Sync</th>

              <th>Status</th>

            </tr>

          </thead>



          <tbody>



            {devices.map(d=>(

              <tr key={d.id}>



                <td style={{fontFamily:'var(--mono)'}}>

                  {d.id}

                </td>



                <td>

                  {d.name}

                </td>



                <td>

                  {d.loc}

                </td>



                <td style={{fontFamily:'var(--mono)',fontSize:'0.8rem'}}>

                  {formatLastSync(d.last_sync)}

                </td>



                <td>

                  <Badge type={d.status}>

                    {d.status}

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



export default Devices;