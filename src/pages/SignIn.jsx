import {React, useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import toastr from 'toastr';
import {
    Box,
    Button,
    Container,
    FormControl,
    Input,
    InputAdornment,
    InputLabel,
    Typography,
  } from "@mui/material";
  import KeyIcon from '@mui/icons-material/Key';
import { generatePrivateKey } from 'nostr-tools';
import { NostrContext } from '../context/NostrContext';


function SignIn(props) {
    const nostrContext = useContext(NostrContext);
    const [pkInput, setPkInput] = useState("");
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        e.preventDefault();
        setPkInput(e.target.value)
    }

    const handlePrivateKeySubmit = (event) => {
        event.preventDefault();
        try{
            console.log(`Setting Private Key: ${pkInput}`)
            nostrContext.privateKey = pkInput;
            navigate("/feed", {replace: true});
        } catch {
            toastr.error(`Not a Valid Key`);
        }
    };

    const handleNewUserClicked = (event) => {
        setPkInput(generatePrivateKey());
    }


    return (
        <Container
        component="form"
        noValidate
        autoComplete="off"
        sx={{
            '& .MuiTextField-root': { m: 1, width: '100%' },
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
        </Container>
    )
}

export default SignIn