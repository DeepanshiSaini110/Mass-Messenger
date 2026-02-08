import React,{useEffect,useState} from "react"; 
import "../styles/theme.css";
import "../styles/Logs.css";


const ITEMS_PER_PAGE=5;

export default function Logs(){
  const [logs,setLogs]=useState([]); //empty initially
  const [search,setSearch]=useState("");
  const [status,setStatus]=useState("");
  const [page,setPage]=useState(1);

  useEffect(()=>{
   fetch("/api/logs")
   .then(res=>res.json())
   .then(data=>setLogs(data));
  },[]);
  const filteredLogs=logs.filter(log=>{
    const matchText=log.recipient?.toLowerCase().includes(search.toLowerCase()) || log.email?.toLowerCase().includes(search.toLowerCase()) ||log.message?.toLowerCase().includes(search.toLowerCase());
    const matchStatus=!status || log.status === status;
    return matchText && matchStatus;
  });
  const start=(page-1)*ITEMS_PER_PAGE;
  const paginated=filteredLogs.slice(start,start+ITEMS_PER_PAGE);
  const totalPages=Math.ceil(filteredLogs.length/ITEMS_PER_PAGE);
  return(
    <div className="logs-container bg-cyber bg-grid">
      <div className="logs-wrapper">
        <div className="header">
          <h1 className="page-title">Message Logs</h1>
          <p className="page-subtitle">View Delivery History</p>
        </div>
        <div className="filters">
          <input className="filter-input" placeholder="Search recipient..." onChange={e=>{setSearch(e.target.value); setPage(1);}}/>
          <select className="filter-input" onChange={e=>{setStatus(e.target.value);setPage(1);}}>
            <option value="">All Status</option>
            <option>Delivered</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Recipient</th>
                <th>Email</th>
                <th>Message</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length===0?(
                <tr>
                  <td colSpan="5" className="empty">No Logs Found</td>
                </tr>
              ):(
                paginated.map((log,i)=>(
                <tr key={i}>
                  <td className="timestamp">{log.timestamp}</td>
                  <td className="recipient">{log.recipient}</td>
                  <td>{log.email}</td>
                  <td>{log.message}</td>
                  <td className={`status ${log.status.toLowerCase()}`}>● {log.status}</td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages>1 && (
          <div className="pagination">
            {[...Array(totalPages)].map((_,i)=>(
              <button key={i} className={page===i +1 ? "active":""} onClick={()=>setPage(i+1)}>{i+1}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
