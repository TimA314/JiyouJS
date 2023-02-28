import {React, useEffect, useState } from 'react';
import './SignIn.css';
import {
    Box,
    Button,
    FormControl,
    Input,
    InputAdornment,
    InputLabel,
    TextField,
    Typography,
    useFormControl
  } from "@mui/material";
  import KeyIcon from '@mui/icons-material/Key';
import toastr from 'toastr';
import { setPrivateKey } from '../redux/nostr';

function SignIn(props) {
    const [pkInput, setPkInput] = useState("");

    const handleInputChange = (e) => {
        e.preventDefault();
        setPkInput(e.target.value)
    }

    const handlePrivateKeySubmit = async (event) => {
        event.preventDefault();
        console.log(`Setting Private Key: ${pkInput}`)
        setPrivateKey(pkInput);
    };


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
            </FormControl>
        </Box>
    )
}

export default SignIn