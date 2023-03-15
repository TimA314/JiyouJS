import {React, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from "react-router-dom";
import toastr from 'toastr';
import { generatePrivateKey, getPublicKey, SimplePool } from 'nostr-tools';
import { bech32ToHex } from '../util';
import { isValidKey, loadProfile } from '../NostrFunctions';

import {
    Box,
    Button,
    Container,
    Divider,
    FormControl,
    Input,
    InputAdornment,
    InputLabel,
    styled,
    Typography,
  } from "@mui/material";
  import KeyIcon from '@mui/icons-material/Key';
import { Stack } from '@mui/system';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  }));
  
  const StyledSection = styled('div')(({ theme }) => ({
    width: '100%',
    maxWidth: 480,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default,
  }));
  
  const StyledContent = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0),
  }));
  
  // ----------------------------------------------------------------------


function SignIn(props) {
    const [pkInput, setPkInput] = useState("");
    const privateKey = window.localStorage.getItem("localPk");
    const relays = props.relays;
    const navigate = useNavigate();
    const pool = new SimplePool();

    useEffect(() => {
        console.log("Local pk: " + privateKey);
        if (isValidKey(privateKey)){
            loadUser(getPublicKey(privateKey));
            navigate("/feed", {replace: true});
        }
    }, [])

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
        const profile = await pool.list(relays, [{kinds: [0], authors: [pub], limit: 1 }]);
        props.setProfile(profile);
        console.log(profile);
    }

    const handleNewUserClicked = (event) => {
        setPkInput(generatePrivateKey());
    }

    return (
        <StyledRoot>
            <Container maxWidth="sm">
                <StyledContent>
                    <Typography variant="h4" gutterBottom>
                        Sign In
                    </Typography>
                    <InputLabel htmlFor="privateKey-input" color='secondary'>
                        Private Key
                    </InputLabel>
                    <Stack direction="row" spacing={2} marginBottom="10px">
                        <Input
                            id="privateKey-input"
                            fullWidth
                            size="large"
                            value={pkInput}
                            color="secondary"
                            onChange={(e) => setPkInput(e.target.value)}
                            startAdornment={
                                <InputAdornment position="start">
                                    <KeyIcon />
                                </InputAdornment>
                            } />
                    </Stack>
                    <Button fullWidth size="large" color="primary" variant="outlined" onClick={handlePrivateKeySubmit}>
                        Log In
                    </Button>
                    <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        OR
                    </Typography>
                    </Divider>
                    <Button fullWidth size="large" color="warning" variant="outlined" onClick={handleNewUserClicked} >
                        New User? Generate Private Key
                    </Button>
                </StyledContent>
            </Container>
        </StyledRoot>
    )
}

export default SignIn