import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { UsersInterface } from "../models/IUser";
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CartsInterface } from '../models/ICart';
import { BuildingsInterface } from '../models/IBuilding';
import { RoomsInterface } from '../models/IRoom';
import { RHDsInterface } from '../models/IRHD';
import { JobTypesInterface } from '../models/IJobType';
import { DevicesInterface } from '../models/IDevice';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { EstimateInterface } from '../models/IEstimate';
import { RequestsInterface } from '../models/IRequest';
import { Link as RouterLink } from "react-router-dom";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Snackbar from '@mui/material/Snackbar';

import { 
  GetUser, 
  ListEstimates, ListRequests,
  GetRequest,GetRHD, GetBuilding, 
  GetRoom, CreateCart 
} from "../services/HttpClientService";
import Divider from '@mui/material/Divider';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert( props, ref ) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
 });

function CartCreate() { //ตัวแปร
  const [user, setUser] = useState<UsersInterface>({});
  const [cart, setCart] = useState<CartsInterface>({
    Work_Date: new Date(),
  });
  const [requests, setRequests] = useState<RequestsInterface[]>([]);
  //เก็บแค่ตัวเดียว
  const [request, setRequest] = useState<RequestsInterface>({});
  const [building, setBuilding] = useState<BuildingsInterface>({});
  // ตัวเลือกสำหรับ Combobox
  const [estimates, setEstimates] = useState<EstimateInterface[]>([]);
  const [room, setRoom] = useState<RoomsInterface>({});
  const [RHDs, setRHDs] = useState<RHDsInterface>({});
  const [jobtypes, setJobTypes] = useState<JobTypesInterface[]>([]);
  const [device, setDevices] = useState<DevicesInterface[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  //แปรจาก string ให้เป็น number
  const convertType = (data: string | number | undefined) => {
  let val = typeof data === "string" ? parseInt(data) : data;
  return val;
  };

  //ปิดตัวที่แสดงการบันทึก
  const handleClose = (
  event?: React.SyntheticEvent | Event,
  reason?: string
) => {
  if (reason === "clickaway") {
    return;
  }
  setSuccess(false);
  setError(false);
  };

  //โหลด user 
  const getUser = async () => {
    let res = await GetUser();
    if (res) {
      setUser(res);
      console.log("Load User Complete");
    }
    else{
      console.log("Load User InComplete!!!!");
    }
  };
//โหลด Estimates มาทั้งหมด
  const listEstimates = async () => {
    let res = await ListEstimates();
    if (res) {
      setEstimates(res);
      console.log("Load Estimates Complete");
    }
    else{
      console.log("Load Estimates InComplete!!!!");
    }
  };
//แค่โหลดRequests ลงใน combobox
  const listRequests = async () => {
    let res = await ListRequests();
    if (res) {
      setRequests(res);
      console.log("Load Request Complete");
    }
    else{
      console.log("Load Request InComplete!!!!");
    }
  };
//หลังเลือก request แล้วจะโหลดข้อมูลที่ใส่มา
  const onChangeRequest = async (e: SelectChangeEvent) =>{
    let id = e.target.value;
    let res = await GetRequest(id);
//เราเลือก request 
    if (res) {
      setRequest(res);  
      console.log("Load Request ID Complete");
    }
    else{
      console.log("Load Request ID Incomplete!!!");
    }
    id = res.ID;
    res = await GetRHD(id);
    if (res) {
      setRHDs(res);
      
      console.log("Load RHD Complete");
    }
    else{
      console.log("Load RHD Incomplete!!!");
    }
    id = res.RoomID;
    res = await GetRoom(id);
    if (res) {
      setRoom(res);
      
      console.log("Load Room Complete");
    }
    else{
      console.log("Load Room Incomplete!!!");
    }
    id = res.BuildingID;
    res = await GetBuilding(id);
    if (res) {
      setBuilding(res);

      console.log("Load Building Complete");
    }
    else{
      console.log("Load Building Incomplete!!!");
    }
  }

//ทำแค่ครั้งเดียว
  useEffect(() => {
    getUser();
    listEstimates();
    listRequests();
  }, []);
//ทำสำเร็จไหม
  async function submit() {
    let data = {
      Work_Date: cart.Work_Date,
      UserID: convertType(user.ID),
      EstimateID: convertType(cart.EstimateID),
      RequestID: convertType(cart.RequestID),

    };

    let res = await CreateCart(data);
    console.log(res);
    if (res) {
      setSuccess(true);
    } else {
      setError(true);
    }
  }
  
  //รับค่าจาก combobox เพื่อไปสร้าง entity
  const handleChange = (event: SelectChangeEvent) => {
    const name = event.target.name as keyof typeof cart;
    const value = event.target.value;
    setCart({
      ...cart,
      [name]: value,
    });
    console.log(`[${name}]: ${value}`);
  };

  return (
    <div>
    <Container maxWidth="md">
            <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}
             anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <Alert onClose={handleClose} severity="success">
               บันทึกข้อมูลสำเร็จ
              </Alert>
           </Snackbar>

           <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
             <Alert onClose={handleClose} severity="error">
               บันทึกข้อมูลไม่สำเร็จ
             </Alert>
           </Snackbar>
      <Paper>

        <Box flexGrow={1}>
          <Paper>
            <Box sx = {{paddingX : 2,paddingY : 2}}>
              <Typography
                component="h5"
                variant="h5"
                color="primary"
                gutterBottom
              >
                บันทึกการจองตารางงาน
              </Typography>
            </Box>
          </Paper>
              <Divider />
        </Box>

        <Grid container spacing={3} sx={{ padding: 2 }}>       
          <Grid item xs={12}>
            <p>ชื่อ</p>
            <FormControl fullWidth variant="outlined">
              <TextField
                value={user.Name || ""}
                InputProps={{
                  readOnly: true,
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">     
              <p>รายการแจ้งซ่อม</p>
              <Select
                required
                defaultValue={"0"}
                onChange={(e) => {
                  (handleChange(e));
                  onChangeRequest(e);
                }}
                inputProps={{
                  name: "RequestID",
                }}
              >
                <MenuItem value={"0"}>เลือกงานที่ต้องการซ่อมบำรุง</MenuItem>
                  {requests?.map((item: RequestsInterface) => {
                    //แสดงใน console มาข้อมูลเข้ามั้ย
                    //ถ้ามีคนเลือกจะไม่เป็น null ใน perload requset
                    console.log(item.Cart);
                    if (item.Cart == null) {
                    return(<MenuItem
                      key={item.ID}
                      value={item.ID}
                    >
                      {item.ID}
                    </MenuItem>)
                    }
                  })}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <p>รายละเอียดการแจ้งซ่อม</p>
            <FormControl fullWidth variant="outlined">
              <TextField
                value={request?.Explain || ""}
                InputProps={{
                  readOnly: true,
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <p>ห้อง</p>
            <FormControl fullWidth variant="outlined">
              <TextField
                value={room?.Name || ""}
                InputProps={{
                  readOnly: true,
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <p>ตึก</p>
            <FormControl fullWidth variant="outlined">
              <TextField
                value={building?.Name || ""}
                InputProps={{
                  readOnly: true,
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <p>ประเภทการซ่อมบำรุง</p>
            <FormControl required fullWidth variant="outlined">   
              <Select
                defaultValue={"0"}
                onChange={handleChange}
                inputProps={{
                  name: "EstimateID",
                }}
              >
                <MenuItem value={"0"}>กรุณาเลือกประเภทการซ่อมบำรุง</MenuItem>
                  {estimates?.map((item: EstimateInterface) => 
                    <MenuItem
                      key={item.ID}
                      value={item.ID}
                    >
                      {item.Name}
                    </MenuItem>
                  )}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <p>วันที่ออกไปปฏิบัติงาน</p>
            <FormControl fullWidth variant="outlined">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={cart.Work_Date}
                  onChange={(newValue) => {
                    setCart({
                      ...cart,
                      Work_Date: newValue,
                    });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button component={RouterLink} to="/carts" variant="contained">
              Back
            </Button>
            <Button
              style={{ float: "right" }}
              onClick={submit}
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </Grid> 
          
        </Grid>
      </Paper>
    </Container>
    </div>
    
  );
}

export default CartCreate;