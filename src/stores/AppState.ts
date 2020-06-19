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
* AppState.ts
*/
import { observable, action, computed } from "mobx"


interface AuthStep {
    completed: boolean;
    error: null|any;
    data: null|any;
}
const defaultAuthStep = {
    completed: false,
    error: null,
    data: null,
}


interface StoredState  {
    activeStep: number;
    steps: AuthStep[];
}

const defaultState: StoredState = {
    activeStep: 0,
    steps: [],
}


function newAuthStep() : AuthStep {
    return Object.assign({}, defaultAuthStep);
}

function newStoredState(): StoredState {
    return Object.assign({}, defaultState)
}

class AppState {
    @observable settingsOpen=false
    @observable aboutOpen=false;
    @observable profileOpen = false;
    @observable activeStep = 0;
    @observable steps:AuthStep[] = [];
    @observable authz_response = ''

    constructor() {
        this.getStoredState()
    }

    @action.bound
    setValue(name:string, value:any) {
        switch(name) {
            case 'activeStep': {
                this.activeStep = value
                break
            }
            case 'steps': {
                this.steps = value
                break
            }
            default: {
                console.log('Unknown value', value);
                throw new Error('Unknown value');
            }
        }
    }


    storableState = () => {
        const config:StoredState = newStoredState()
        config.activeStep = this.activeStep
        config.steps = this.steps
        return config
    }

    saveState = () => {
        const state = this.storableState()
        localStorage.setItem('app-state', JSON.stringify(state))
    }

        /**
     * Loads the saved value and config from localStorage.
     * As a quick hack, if there is no saved state, then load
     * the msc/xu default doc.
     */
    getStoredState() {
        const configStr = localStorage.getItem('app-state')
        if (configStr !== null) {
            const config = JSON.parse(configStr)
            Object.keys(config).forEach(key => {
                this.setValue(key, config[key])
            })
        } else {
            // If there's no saved state, save it for cleaner processing
            this.saveState()
        }
    }

    /**
     * Clear out old state, if needed.
     */
    resetSavedState = () => {
        localStorage.clear()
        sessionStorage.clear()
        this.getStoredState()
    }

    @action.bound
    reset = () => {
        this.settingsOpen=false
        this.aboutOpen=false;
        this.profileOpen = false;
        this.activeStep = 0;
        this.steps = [];
        this.authz_response = ''
        this.resetSavedState()
    }


    @action.bound
    setSettingsOpen(s:boolean) {
        this.settingsOpen = s
    }
    @action.bound
    setAboutOpen(s:boolean){
        this.aboutOpen = s
    }
    @action.bound
    setProfileOpen(s:boolean) {
        this.profileOpen = s
    }
    @action.bound
    setActiveStep(step:number) {
        this.activeStep = step;
        if(this.steps.length < step){
            for(let i = this.steps.length; i < step; i++) {
                this.steps.push( newAuthStep())
            }
        }
        this.saveState()
    }

    isStepCompleted(step:number): boolean {
        if((this.steps.length) > step) {
            return this.steps[step].completed
        }
        return false
    }


    @action.bound
    setCompletedStep(step:number, completed:boolean) {
        if(!(this.steps.length > step)){
            for(let i = this.steps.length; i < step+1; i++) {
                this.steps.push( newAuthStep())
            }
        }
        this.steps[step].completed = completed
        this.saveState()
    }

    @action.bound
    setStepError(step:number, error:string) {
        if(!(this.steps.length > step)){
            for(let i = this.steps.length; i < step+1; i++) {
                this.steps.push( newAuthStep())
            }
        }
        this.steps[step].error = error
        this.saveState()
    }
    @action.bound
    setStepData(step:number, data:any) {
        if(!(this.steps.length > step)){
            for(let i = this.steps.length; i < step+1; i++) {
                this.steps.push( newAuthStep())
            }
        }
        this.steps[step].data = data
        this.saveState()
    }
    @computed
    get completedSteps() {
        return this.steps.length
    }

    @action.bound
    setAuthzResponse(url:string) {
        this.authz_response = url
    }
}
const appState = new AppState()
export default appState