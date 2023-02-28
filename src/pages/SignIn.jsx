import {React, useState } from 'react';
import { useNavigate } from "react-router-dom";
import toastr from 'toastr';
import './SignIn.css';
import {
    Box,
    Button,
    FormControl,
    Input,
    InputAdornment,
    InputLabel,
    Typography,
  } from "@mui/material";
  import KeyIcon from '@mui/icons-material/Key';
import { setPrivateKey } from '../redux/nostr';
import { useDispatch} from 'react-redux';
import { generatePrivateKey } from 'nostr-tools';


function SignIn(props) {
    const [pkInput, setPkInput] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        e.preventDefault();
        setPkInput(e.target.value)
    }

    const handlePrivateKeySubmit = (event) => {
        event.preventDefault();
        try{
            console.log(`Setting Private Key: ${pkInput}`)
            dispatch(setPrivateKey(pkInput));
            navigate("/follows", {replace: true});
        } catch {
            toastr.error(`Not a Valid Key`);
        }
    };

    const handleNewUserClicked = (event) => {
        setPkInput(generatePrivateKey());
    }


    return (
        <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}>
            <FormControl variant="standard">
                <Box>
                    <InputLabel htmlFor="privateKey-input" color='secondary'>
                    Private Key
                    </InputLabel>
                    <Input
                        id="privateKey-input"
                        fullWidth
                        value={pkInput}
                        color="secondary"
                        onChange={(e) => handleInputChange(e)}
                        startAdornment={
                            <InputAdornment position="start">
                                <KeyIcon />
                            </InputAdornment>
                        } />
                </Box>
                <Button
                    fullWidth
                    type="button"
                    onClick={handlePrivateKeySubmit}
                    color="secondary"
                    sx={{
                        m: "2rem 0",
                        p: "1rem",
                    }}
                    >
                    <Typography>Log In</Typography>
                </Button>
                <Button
                    fullWidth
                    type="button"
                    onClick={handleNewUserClicked}
                    color="warning"
                    sx={{
                        m: "2rem 0",
                        p: "1rem",
                    }}
                    >
                    <Typography>New User? Generate Private Key</Typography>
                </Button>
            </FormControl>
        </Box>
    )
}

export default SignIn