/**
* Copyright (c) 2020 David Skyberg and Swankymutt.com
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*
* CodeStepper.tsx
*/
import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import jwtDecode from 'jwt-decode'
import {observer} from 'mobx-react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import appState from '../stores/AppState'
import authStore from '../stores/AuthStore'
import JSONPretty from 'react-json-pretty'
import 'react-json-pretty/themes/monikai.css'


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '75%',
      marginTop:20,
    },
    stepper: {
        backgroundColor: theme.palette.primary.dark,
    },
    button: {
      marginRight: theme.spacing(1),
    },
    backButton: {
      marginRight: theme.spacing(1),
    },
    completed: {
      display: 'inline-block',
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      fontWeight: 500,
      fontSize: '1.2rem'
    },
    data: {
      marginTop: 20,
      height: 400,
      overflow: 'scroll',
    }
  }),
);

const steps = [
  {
    label:'Metadata Request',
    instructions: 'Metadata: Fetch the OIDC Provider metadata directly from the provider\'s public endpoint, and configure the client with the information.',
  },
  {
    label:'Authorization Request',
    instructions: 'Authorize: Your browser will be sent directly to the provider\'s domain.  You will authenticate to the provider, and consent to share your account attributes. The provider will then send you back to this app with an OIDC Authorization Code.'
  },
  {
    label:'Token Request',
    instructions: 'Tokens: We will exchange the returned Authorization Code for an access_token and id_token.'
  }
];

function getStepContent(step: number) {
  if(step >= 0 && step < steps.length) {
    return steps[step].instructions;
  }
  return 'Unknown step';
}

const  CodeStepper = observer(() => {
  const classes = useStyles();
  const activeStep = appState.activeStep

  const totalSteps = () => {
    return steps.length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const isStepFailed = (step: number) => {
    return appState.completedSteps >= totalSteps() && appState.steps[step].error !== null;
  };

  const handleBack = () => {
    if(activeStep > 0)
    appState.setActiveStep(activeStep - 1);
  }

  const handleNext = () => {
      if(isLastStep() ) {
        appState.setActiveStep(0)
      }
      else {
        appState.setActiveStep(activeStep+1)
      }
  }

  const handleStep = () => {

      switch(activeStep) {
        case 0: {
          // Get the OIDC published metadata
          authStore.getMetadata()
          .then((metadata) => {
            appState.setCompletedStep( activeStep, true);
            appState.setStepData(activeStep, metadata)
          })
          .catch((error) => {
            appState.setStepError(activeStep, error)
          })
          break;
        }
        case 1: {
          authStore.login()
          .then(() => {
            appState.setCompletedStep( activeStep, true);
          })
          .catch(error => {
            appState.setStepError(activeStep, error)
          })
          break;
        }
        case 2: {
          authStore.completeLogin(appState.authz_response)
          .then((user) => {
            if(user) {
              const data = {
                access_token: user.access_token,
                expires_at: user.expires_at,
                id_token: user.id_token,
                id_token_payload: jwtDecode(user.id_token),
                refresh_token: user.refresh_token,
                scope: user.scope,
                profile: user.profile
              }
              appState.setStepData(activeStep, data)
            }
            appState.setCompletedStep( activeStep, true);
          })
          .catch(error => {
            appState.setStepError(activeStep, error)
          })
          break;
        }
        default:
          console.log('CodeStepper.handleNext - unexpected value:', activeStep)
      }
      if(activeStep < steps.length - 1) {
       // appState.setActiveStep( activeStep + 1);
      }
  };


  const renderData = () => {
    if(appState.isStepCompleted(activeStep) ) {
      switch(activeStep) {
        case 0: {
          return (
            <div className={classes.data}>
              <JSONPretty data={JSON.stringify(appState.steps[activeStep].data, null, 3)} style={{maxHeight:200}}/>
            </div>
          )
        }
        case 1:
        case 2: {
          if(appState.isStepCompleted(activeStep) && appState.steps[activeStep].data !== null) {
            return (
              <div className={classes.data}>
                <JSONPretty data={JSON.stringify(appState.steps[activeStep].data, null, 3)} style={{maxHeight:200}}/>
              </div>
            )
          }
          return null;
        }
      }
    }
    return null
  }

  return (
    <Card className={classes.root}>
      <CardContent>
        <Stepper activeStep={activeStep} className={classes.stepper}>
          {steps.map((step, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: { optional?: React.ReactNode; error?: boolean } = {};
            if (isStepFailed(index)) {
              labelProps.error = true;
              labelProps.optional = (
                <Typography variant="caption" color="error">
                  {appState.steps[index].error}
                </Typography>
              )
            }
            return (
              <Step key={index} {...stepProps}>
                <StepLabel {...labelProps}>{steps[index].label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </CardContent>
      <CardContent>
        <Typography className={classes.instructions}>
          {getStepContent(activeStep)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="primary"
          disabled={activeStep === 0}
          onClick={handleBack}
          className={classes.button}>
          Back
        </Button>

              <Button
                variant="contained"
                color="primary"
                disabled={!appState.isStepCompleted(activeStep) || activeStep === steps.length-1}
                onClick={handleNext}
                className={classes.button}
              >
                Next
              </Button>

              {activeStep !== steps.length &&
                (appState.isStepCompleted(activeStep) ? (
                  <Typography variant="caption" className={classes.completed}>
                    Step {activeStep + 1} is complete
                  </Typography>
                ) : (
                  <Button variant="contained" color="primary" onClick={handleStep}>
                    {appState.completedSteps === totalSteps() - 1 ? 'Finish' : 'Complete Step'}
                  </Button>
                ))}
                </CardActions>
                <CardContent>
          {renderData()}
      </CardContent>
      </Card>
  );
})
export default CodeStepper
