import {React, useContext, useEffect, useState } from 'react';
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
import { generatePrivateKey, getPublicKey } from 'nostr-tools';
import { NostrContext } from '../context/NostrContext';
import { bech32ToHex } from '../util';
import * as secp from "@noble/secp256k1";



function SignIn(props) {
    const nostrContext = useContext(NostrContext);
    const [pkInput, setPkInput] = useState("");
    const navigate = useNavigate();
    const sessionPk = window.sessionStorage.getItem("pk");
    console.log("session pk: " + sessionPk);

    useEffect(() => {
        if (secp.utils.isValidPrivateKey(sessionPk)){
            nostrContext.privateKey = sessionPk;
            navigate("/feed");
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
            
            if(secp.utils.isValidPrivateKey(pkInput)){
                nostrContext.privateKey = pkInput;
                window.sessionStorage.setItem("privateKey", pkInput);
                window.sessionStorage.setItem("publicKey", getPublicKey(pkInput));
                console.log("Logged In");
                navigate("/feed", {replace: true});
                return
            }
            
            const hexKey = bech32ToHex(pkInput);
            
            if (secp.utils.isValidPrivateKey(hexKey)) {
                window.sessionStorage.setItem("privateKey", hexKey);
                window.sessionStorage.setItem("publicKey", getPublicKey(hexKey));
                navigate("/feed", {replace: true});
                return
            }
            
            console.log("Invalid Key");
            toastr.error("Not a valid private Key")
            return;
        } catch {
            toastr.error(`There was an error validating the private key.`);
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