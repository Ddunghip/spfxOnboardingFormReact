import * as React from 'react';
import styles from './Onboardingform.module.scss';
import { IOnboardingformProps } from './IOnboardingformProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { DatePicker, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { sp, Web, IWeb, } from "@pnp/sp/presets/all";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Dropdown, IDropdownOption, setFocusVisibility } from '@fluentui/react';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { IStates } from './IStates';
import PageNotFound from './PageNotFound';
import history from './history';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';

var arr = [];
type Props = {

    webURL: any;
    context: any;
    ChoicesRoles: any;
    ChoicesReturnedtowork: any;
    ChoicesOfficelocation: any;
    spconect: any;
    userID: any;

}

export default class ObdForm extends React.Component<Props, IStates> {
    constructor(props) {
        super(props);
        this.state = {
            DDChoicesRoles: "",
            DDChoicesReturnedtowork: "",
            DDChoicesOfficelocation: "",

            tgl: false,
            tglsurface: false,
            tglTablet: false,
            tglCarelink: false,
            tglDogsign: false,
            tglEpicor: false,
            tglIcare: false,
            tglRiskman: false,

            Items: [],
            EmployeeName: "",
            EmployeeNameId: 0,
            ID: 0,
            HireDate: null,
            JobDescription: "",
            HTML: [],
            LastName: "",
            FirstName: "",
            StartDate: "",
            PhoneNumber: "",
            Email: "",
            ExistingPhoneNumber: "",
            WorkstationDescription: "",
            showdetail: false,
            AuthorId: "",
            paramId: "",
            filItem: [],


        };
    };
    public onDropdownChange = (event, item: IDropdownOption): void => {
        this.setState({
            ...this.state, [event.target.title]: item.key as string
        });
    }
    public handleChange(e) {
        this.setState({ ...this.state, [e.target.name]: e.target.value });
    }
    public handleShow() {
        this.setState(e => ({
            showdetail: !e.showdetail
        }))
    }
    public handleToggle(event) {
        this.setState({ ...this.state, [event.target.id]: !this.state[event.target.id] })
        // console.log('check show', this.state[event.target.id], event.target.id);

    }
    public async componentDidMount() {
        await this.fetchData();
    }

    public async fetchData() {
        let web = Web(this.props.webURL);

        const items: any[] = await web.lists.getByTitle("Employee onboarding").items.select("*", "ID/Title").get();
        console.log('check list items >>>>>>>>>>', items);
        this.setState({ Items: items });
        this.getParam();

        const filteritems = items.filter(val => val.ID == this.state.paramId)
        this.setState({ filItem: filteritems })
        console.log('filter items', filteritems.length);
        await this.setData();
    }
    public setData() {
        this.state.filItem.map((val) =>
            this.setState({
                FirstName: val.FirstName,
                LastName: val.LastName,
                PhoneNumber: val.PhoneNumber,
                Email: val.Email,
                ID: val.ID,
                DDChoicesRoles: val.Roles,
                DDChoicesReturnedtowork: val.Is_x0020_Returned_x0020_to_x0020,
                DDChoicesOfficelocation: val.Office_x0020_Location,
                tgl: val.Mobile,
                tglsurface: val.Surface_x0020_Pro,
                tglTablet: val.Tablet,
                tglCarelink: val.Carelink,
                tglDogsign: val.DocSign,
                tglEpicor: val.Epicor,
                tglIcare: val.ICare,
                tglRiskman: val.Riskman,
                EmployeeName: val.Manager,
                EmployeeNameId: val.ManagerId,
                StartDate: new Date(val.StartDate),
                ExistingPhoneNumber: val.Existing_x0020_Phone_x0020_Numbe,
                WorkstationDescription: val.Workstation_x0020_Description,
                AuthorId: val.AuthorId,

            })
        )
        console.log(this.state);

    }
    public findData = (id): void => {
        var itemID = id;
        var allitems = this.state.Items;
        var allitemsLength = allitems.length;
        if (allitemsLength > 0) {
            for (var i = 0; i < allitemsLength; i++) {
                if (itemID == allitems[i].Id) {
                    this.setState({
                        FirstName: allitems[i].FirstName,
                        LastName: allitems[i].LastName,
                        PhoneNumber: allitems[i].PhoneNumber,
                        Email: allitems[i].Email,
                        ID: allitems[i].ID
                    });
                }
            }
        }
    }

    public _getPeoplePickerItems = async (items: any[]) => {

        if (items.length > 0) {

            this.setState({ EmployeeName: items[0].text });
            this.setState({ EmployeeNameId: items[0].id });
        }
        else {
            //ID=0;
            this.setState({ EmployeeNameId: "" });
            this.setState({ EmployeeName: "" });
        }
    }

    public ResetData() {
        history.push(`${history.location.pathname}#/`)

        this.setState({
            DDChoicesRoles: "",
            DDChoicesReturnedtowork: "",
            DDChoicesOfficelocation: "",
            tgl: false,
            tglsurface: false,
            tglTablet: false,
            tglCarelink: false,
            tglDogsign: false,
            tglEpicor: false,
            tglIcare: false,
            tglRiskman: false,
            Items: [],
            EmployeeName: "",
            EmployeeNameId: 0,
            ID: 0,
            // HireDate: null,
            JobDescription: "",
            HTML: [],
            LastName: "",
            FirstName: "",
            StartDate: null,
            PhoneNumber: "",
            Email: "",
            ExistingPhoneNumber: "",
            WorkstationDescription: "",

        });
        console.log(this.state);
        this.fetchData()
    }

    private async SaveData() {
        let web = Web(this.props.webURL);
        await web.lists.getByTitle("Employee onboarding").items.add({
            FirstName: this.state.FirstName,
            LastName: this.state.LastName,
            PhoneNumber: this.state.PhoneNumber,
            Email: this.state.Email,
            StartDate: new Date(this.state.StartDate),
            Workstation_x0020_Description: this.state.WorkstationDescription,
            Existing_x0020_Phone_x0020_Numbe: this.state.ExistingPhoneNumber,
            ManagerId: this.state.EmployeeNameId,
            Roles: this.state.DDChoicesRoles,
            Is_x0020_Returned_x0020_to_x0020: this.state.DDChoicesReturnedtowork,
            Office_x0020_Location: this.state.DDChoicesOfficelocation,
            Mobile: this.state.tgl,
            Surface_x0020_Pro: this.state.tglsurface,
            Tablet: this.state.tglTablet,
            Carelink: this.state.tglCarelink,
            DocSign: this.state.tglDogsign,
            Epicor: this.state.tglEpicor,
            ICare: this.state.tglIcare,
            Riskman: this.state.tglRiskman,


        }).then(i => {
            console.log(i);
        });
        alert("Created Successfully");
        this.ResetData();
        this.fetchData();
    }

    public getParam = async () => {
        const link = window.location.href
        const url = new URL(link)
        const str: string = url.hash
        this.setState({ paramId: str.slice(5) })
        console.log('>>>> id', str.slice(5));
    }
    private async UpdateData() {
        let web = Web(this.props.webURL);
        await web.lists.getByTitle("Employee onboarding").items.getById(this.state.ID).update({

            FirstName: this.state.FirstName,
            LastName: this.state.LastName,
            PhoneNumber: this.state.PhoneNumber,
            Email: this.state.Email,
            StartDate: new Date(this.state.StartDate),
            Workstation_x0020_Description: this.state.WorkstationDescription,
            Existing_x0020_Phone_x0020_Numbe: this.state.ExistingPhoneNumber,
            ManagerId: this.state.EmployeeNameId,
            Roles: this.state.DDChoicesRoles,
            Is_x0020_Returned_x0020_to_x0020: this.state.DDChoicesReturnedtowork,
            Office_x0020_Location: this.state.DDChoicesOfficelocation,
            Mobile: this.state.tgl,
            Surface_x0020_Pro: this.state.tglsurface,
            Tablet: this.state.tglTablet,
            Carelink: this.state.tglCarelink,
            DocSign: this.state.tglDogsign,
            Epicor: this.state.tglEpicor,
            ICare: this.state.tglIcare,
            Riskman: this.state.tglRiskman,

        }).then(i => {
            console.log(i);
        });
        alert("Updated Successfully");
        this.ResetData();
        this.fetchData();
    }
    // private async DeleteData() {
    //     let web = Web(this.props.webURL);
    //     console.log('check delete', this.state.ID);

    //     await web.lists.getByTitle("Employee onboarding").items.getById(this.state.ID).delete()
    //         .then(i => {
    //             console.log(i);
    //         });
    //     alert("Deleted Successfully");
    //     this.ResetData();
    //     this.fetchData();
    // }

    public render(): React.ReactElement<IOnboardingformProps> {
        console.log('check userID', this.props.userID, this.state.AuthorId)


        return (
            this.state.AuthorId === this.props.userID || this.state.paramId == "" ?
                <div className={styles.borderform}>
                    <h1 style={{ color: "#a305a3", textAlign: "center", fontSize: "40px", margin: "0px" }}>New Employee Onboarding</h1>
                    <hr style={{ color: "#a305a3", fontSize: '2px' }}></hr>

                    <div className={styles.form}>
                        <form>
                            <div >
                                <Label>First Name</Label>
                                <TextField value={this.state.FirstName} id="FirstName" name="FirstName"
                                    onChange={(value) => this.handleChange(value)} />

                                <Label>Last Name</Label>
                                <TextField value={this.state.LastName} id="LastName" name="LastName" onChange={(value) => this.handleChange(value)} />

                                <Label>Manager</Label>
                                <PeoplePicker
                                    context={this.props.context}
                                    personSelectionLimit={1}
                                    // defaultSelectedUsers={this.state.EmployeeName===""?[]:this.state.EmployeeName}
                                    required={false}
                                    onChange={this._getPeoplePickerItems}
                                    defaultSelectedUsers={[this.state.EmployeeName ? this.state.EmployeeName : ""]}
                                    showHiddenInUI={false}
                                    principalTypes={[PrincipalType.User]}
                                    resolveDelay={1000}
                                    ensureUser={true}
                                />


                                <Label>Phone Number</Label>
                                <TextField value={this.state.PhoneNumber} id="PhoneNumber" name="PhoneNumber" onChange={(value) => this.handleChange(value)} />

                                <Label>Email</Label>
                                <TextField value={this.state.Email} id="Email" name="Email" onChange={(value) => this.handleChange(value)} />

                                <Label>Start Date</Label>
                                <DatePicker maxDate={new Date()} allowTextInput={false} strings={DatePickerStrings} value={this.state.StartDate} onSelectDate={(e) => { this.setState({ StartDate: e }); }} ariaLabel="Select a date" formatDate={FormatDate} />

                                <Label>Workstation Description</Label>
                                <TextField value={this.state.WorkstationDescription} multiline id="WorkstationDescription" name="WorkstationDescription" onChange={(value) => this.handleChange(value)} />

                                <Label>Existing Phone Number</Label>
                                <TextField value={this.state.ExistingPhoneNumber} id="ExistingPhoneNumber" name='ExistingPhoneNumber' onChange={(value) => this.handleChange(value)} />
                                <Label>Roles</Label>
                                <Dropdown
                                    title='DDChoicesRoles'
                                    placeholder="Find items..."
                                    selectedKey={this.state.DDChoicesRoles}
                                    options={this.props.ChoicesRoles}
                                    onChange={this.onDropdownChange}
                                />
                                <Label>Is Returned To Work </Label>
                                <Dropdown
                                    title='DDChoicesReturnedtowork'
                                    placeholder="Find items..."
                                    selectedKey={this.state.DDChoicesReturnedtowork}
                                    options={this.props.ChoicesReturnedtowork}
                                    onChange={this.onDropdownChange}
                                />
                                <Label>Office Location</Label>
                                <Dropdown
                                    title='DDChoicesOfficelocation'
                                    placeholder="Find items..."
                                    selectedKey={this.state.DDChoicesOfficelocation}
                                    options={this.props.ChoicesOfficelocation}
                                    onChange={this.onDropdownChange}
                                />
                                <Label className={styles.Ilabel}> IT Equipments</Label>
                                <div className={styles.togglegroup}>
                                    <div><Toggle
                                        id='tgl'

                                        // defaultChecked={false}
                                        checked={this.state.tgl}
                                        label="Mobile"
                                        onText="Yes"
                                        offText="No"
                                        onChange={(value) => this.handleToggle(value)}
                                    // onChanged={checked => this.setState({ tgl: checked })}
                                    />
                                    </div>
                                    <div>
                                        <Toggle
                                            id='tglsurface'
                                            checked={this.state.tglsurface}
                                            label="Surface Pro"
                                            onText="Yes"
                                            offText="No"
                                            onChange={(value) => this.handleToggle(value)}
                                        // onChanged={checked => this.setState({ tglsurface: checked })}
                                        />
                                    </div>
                                    <div>
                                        <Toggle
                                            id='tglTablet'
                                            checked={this.state.tglTablet}
                                            label="Tablet"
                                            onText="Yes"
                                            offText="No"
                                            onChange={(value) => this.handleToggle(value)}

                                        // onChanged={checked => this.setState({ tglTablet: checked })}

                                        />
                                    </div>
                                </div>
                                <Label className={styles.Ilabel}> System Access Requirements</Label>
                                <div className={styles.togglegroup}>

                                    <div>
                                        <Toggle
                                            id='tglCarelink'
                                            checked={this.state.tglCarelink}
                                            label="Carelink"
                                            onText="Yes"
                                            offText="No"
                                            onChange={(value) => this.handleToggle(value)}

                                        // onChanged={checked => this.setState({ tglCarelink: checked })}
                                        />
                                    </div>
                                    <div>
                                        <Toggle
                                            id='tglDogsign'
                                            checked={this.state.tglDogsign}
                                            label="DocSign"
                                            onText="Yes"
                                            offText="No"
                                            onChange={(value) => this.handleToggle(value)}

                                        // onChanged={checked => this.setState({ tglDogsign: checked })}
                                        />
                                    </div>
                                    <div>
                                        <Toggle
                                            id='tglEpicor'
                                            checked={this.state.tglEpicor}
                                            label="Epicor"
                                            onText="Yes"
                                            offText="No"
                                            onChange={(value) => this.handleToggle(value)}

                                        // onChanged={checked => this.setState({ tglEpicor: checked })}
                                        />
                                    </div>
                                    <div>
                                        <Toggle
                                            id='tglIcare'
                                            checked={this.state.tglIcare}
                                            label="ICare"
                                            onText="Yes"
                                            offText="No"
                                            onChange={(value) => this.handleToggle(value)}

                                        // onChanged={checked => this.setState({ tglIcare: checked })}
                                        />
                                    </div>
                                    <div>
                                        <Toggle
                                            id='tglRiskman'
                                            checked={this.state.tglRiskman}
                                            label="Riskman"
                                            onText="Yes"
                                            offText="No"
                                            onChange={(value) => this.handleToggle(value)}

                                        // onChanged={checked => this.setState({ tglRiskman: checked })}
                                        />
                                    </div>
                                </div>
                                <br />
                            </div>
                        </form>
                    </div>
                    <div className={styles.btngroup}>
                        {this.state.filItem.length === 0 ?
                            <div><PrimaryButton className={styles.btngroupx} text="Submit" onClick={() => this.SaveData()} /></div> :
                            <div><PrimaryButton className={styles.btngroupx} text="Update" onClick={() => this.UpdateData()} /></div>
                        }
                        <div><PrimaryButton className={styles.btngroupx} text="Reset" onClick={() => this.ResetData()} /></div>


                    </div>
                </div> : <PageNotFound />




        );
    }
}
export const DatePickerStrings: IDatePickerStrings = {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    goToToday: 'Go to today',
    prevMonthAriaLabel: 'Go to previous month',
    nextMonthAriaLabel: 'Go to next month',
    prevYearAriaLabel: 'Go to previous year',
    nextYearAriaLabel: 'Go to next year',
    invalidInputErrorMessage: 'Invalid date format.'
};
export const FormatDate = (date): string => {
    console.log(date);
    var date1 = new Date(date);
    var year = date1.getFullYear();
    var month = (1 + date1.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date1.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return day + '/' + month + '/' + year;
};