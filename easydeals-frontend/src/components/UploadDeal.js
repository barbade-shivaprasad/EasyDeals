import { Avatar, Box, TextField } from "@mui/material";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import transport from "../methods/transport";
import { v4 as uuid } from "uuid";
import {MenuItem} from "@mui/material";
import { display } from "../methods/styling";
import { socket } from "../methods/socket";

const UploadDeal = ({notify}) => {
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("title is required"),
    description: Yup.string().required("Description is required"),
  });

  const Input = styled("input")({
    display: "none",
  });

  const [filename, setFilename] = useState("");
  const [type, setType] = useState("normal");

  const types = ["normal" , "emergency"];



  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const submitHandler = async (data) => {

    display('progress','block');
    console.log(data);
    const uploadData = new FormData();
    uploadData.append("id", uuid());
    uploadData.append("title", data.title);
    uploadData.append("description", data.description);
    uploadData.append("status", "incomplete");
    uploadData.append("type", type);
    uploadData.append("file", filename);

    try {
      let res = await transport.post(
        "http://localhost:5000/dealupload",
        uploadData,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      );
      
      if(res.status !==202){

        socket.emit('dealupload');
        display('progress','none')
        notify('success','upload successful')
        document.getElementById('formUpload').reset();
      }
      else
      throw new Error(res.data);
    } catch (error) {
      display('progress','none')
      console.log(error);
      notify('error','failure')
    }
  };
  return (
    <div className="uploadDeal">

      <Box
        component="form"
        id="formUpload"
        noValidate
        sx={{ mt: 1, zIndex: "1" }}
        onSubmit={handleSubmit(submitHandler)}
        >
        <h5>Add Deal</h5>
        <TextField
          size="small"
          margin="normal"
          fullWidth
          id="title"
          label="Title"
          name="title"
          autoComplete="title"
          autoFocus
          aria-required
          {...register("title")}
          error={errors.title ? true : false}
          helperText={errors.title?.message}
        />
        <TextField
          multiline
          margin="normal"
          required
          fullWidth
          id="description"
          label="Description"
          name="description"
          autoComplete="description"
          aria-required
          {...register("description")}
          error={errors.description ? true : false}
          helperText={errors.description?.message}
          minRows={3}
          size="small"
        />

        <TextField
          size="small"
          margin="normal"
          id="select type"
          select
          label="Select"
          value={type}
          onChange={e=>setType(e.target.value)}
          helperText="Please select Type of deal"
        >
          {types.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <label htmlFor="icon-button-file">
          <Input
            accept="image/*"
            id="icon-button-file"
            type="file"
            onChange={(e) => setFilename(e.target.files[0])}
          />
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
          >
            <PhotoCamera />
          </IconButton>
          add Image
        </label>
        <div>
          <small color="blue">{filename.name}</small>
        </div>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Upload
        </Button>
      </Box>
    </div>
  );
};

export default UploadDeal;
