import {React, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import toastr from 'toastr';
import { generatePrivateKey, getPublicKey, SimplePool } from 'nostr-tools';
import { bech32ToHex } from '../util';
import { isValidKey, loadProfile } from '../NostrFunctions';

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


function SignIn(props) {
    const [pkInput, setPkInput] = useState("");
    const privateKey = window.localStorage.getItem("localPk");
    const relays = props.relays;
    const navigate = useNavigate();
    
    useEffect(() => {
        console.log("Local pk: " + privateKey);
        if (isValidKey(privateKey)){
            loadUser(getPublicKey(privateKey));
            navigate("/feed", {replace: true});
        }
    }, [])

    const handleInputChange = (e) => {
        e.preventDefault();
        setPkInput(e.target.value)
    }

    const handlePrivateKeySubmit = (event) => {
        event.preventDefault();
        try{
            console.log(`Setting Private Key: ${pkInput}`)
            
            if(isValidKey(pkInput)){
                window.localStorage.setItem("localPk", pkInput);
                loadUser(getPublicKey(pkInput));

                console.log("Logged In");
                navigate("/feed", {replace: true});
                return
            }
            
            const hexKey = bech32ToHex(pkInput);
            
            if (isValidKey(hexKey)) {
                window.localStorage.setItem("localPk", hexKey);

                loadUser(getPublicKey(hexKey));
                navigate("/feed", {replace: true});
                return
            }
            
            console.log("Invalid Key");
            toastr.error("Not a valid private Key")
            return;
        } catch (error) {
            console.error(error)
            toastr.error(`There was an error validating the private key.`, error);
        }
    };

    const loadUser = async (pub) => {
        let pool = new SimplePool();
        const profile = loadProfile(pool, pub, relays);
        console.log(profile);
        pool.close();
    }

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
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
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