import * as React from 'react';
import styles from './Onboardingform.module.scss';
import { IOnboardingformProps } from './IOnboardingformProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { DatePicker, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { sp, Web, IWeb } from "@pnp/sp/presets/all";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Dropdown, IDropdownOption } from '@fluentui/react';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';


var arr = [];


export interface IStates {
    DDChoicesRoles: string;
    DDChoicesReturnedtowork: string;
    DDChoicesOfficelocation: string;
    tgl: boolean;
    tglsurface: boolean;



    Items: any;
    ID: any;
    EmployeeName: any;
    EmployeeNameId: any;
    HireDate: any;
    JobDescription: any;
    HTML: any;
    LastName: any;
    FirstName: any;
    StartDate: any;
    PhoneNumber: any;
    Email: any;
    ExistingPhoneNumber: any;
    WorkstationDescription: any;

}

export default class ObdForm extends React.Component<IOnboardingformProps, IStates> {
    constructor(props) {
        super(props);
        this.state = {
            DDChoicesRoles: "",
            DDChoicesReturnedtowork: "",
            DDChoicesOfficelocation: "",
            tgl: false,
            tglsurface: false,

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

        };
    };


    // public _onChange(ev, checked: boolean) {
    //     // console.log('toggle is ' + (checked ? 'checked' : 'not checked'), checked);
    //     let value = checked
    //        this.setState(this.state.tglsurface : value)
    //     console.log(checked, this.state.tglsurface, ev.target.value);
    // }
    public onDropdownChange = (event, item: IDropdownOption): void => {
        this.setState({
            ...this.state, [event.target.title]: item.key as string
        });
        console.log(item, this.state, event.target.title);
    }
    public handleChange(e) {
        this.setState({ ...this.state, [e.target.name]: e.target.value });
        console.log("name", e.target.name, "state", this.state, "value", e.target.value);
    }

    public async componentDidMount() {
        await this.fetchData();
    }

    public async fetchData() {
        let web = Web(this.props.webURL);
        const items: any[] = await web.lists.getByTitle("Employee onboarding").items.select("*", "ID/Title").get();
        console.log(items);
        this.setState({ Items: items });
        let html = await this.getHTML(items);
        this.setState({ HTML: html });
    }
    public findData = (id): void => {
        //this.fetchData();
        var itemID = id;
        var allitems = this.state.Items;
        var allitemsLength = allitems.length;
        if (allitemsLength > 0) {
            for (var i = 0; i < allitemsLength; i++) {
                if (itemID == allitems[i].Id) {
                    this.setState({
                        ID: itemID,
                        EmployeeName: allitems[i].Employee_x0020_Name.Title,
                        EmployeeNameId: allitems[i].Employee_x0020_NameId,
                        HireDate: new Date(allitems[i].HireDate),
                        JobDescription: allitems[i].Job_x0020_Description
                    });
                }
            }
        }
    }

    public async getHTML(items) {
        var tabledata = <table className={styles.table}>
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Phone Number </th>
                    <th>Email </th>
                    <th>Start Date </th>
                    <th>Workstation Description </th>
                    <th>Existing Phone Number </th>
                </tr>
            </thead>
            <tbody>
                {items && items.map((item, i) => {
                    return [
                        <tr key={i} onClick={() => this.findData(item.ID)}>
                            <td>{item.FirstName}</td>
                            <td>{item.LastName}</td>
                            <td>{item.PhoneNumber}</td>
                            <td>{item.Email}</td>
                            <td>{FormatDate(item.StartDate)}</td>
                            <td>{item.Workstation_x0020_Description}</td>
                            <td>{item.Existing_x0020_Phone_x0020_Numbe}</td>


                        </tr>
                    ];
                })}
            </tbody>
        </table>;
        return await tabledata;
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
        this.setState({
            DDChoicesRoles: "",
            DDChoicesReturnedtowork: "",
            DDChoicesOfficelocation: "",
            tgl: false,
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

        })
        console.log(this.state);


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

        }).then(i => {
            console.log(i);
        });
        alert("Created Successfully");
        this.setState({ EmployeeName: "", HireDate: null, JobDescription: "" });
        this.fetchData();
    }
    private async UpdateData() {
        let web = Web(this.props.webURL);
        await web.lists.getByTitle("Employee onboarding").items.getById(this.state.ID).update({

            Employee_x0020_NameId: this.state.EmployeeNameId,
            HireDate: new Date(this.state.HireDate),
            Job_x0020_Description: this.state.JobDescription,

        }).then(i => {
            console.log(i);
        });
        alert("Updated Successfully");
        this.setState({ EmployeeName: "", HireDate: null, JobDescription: "" });
        this.fetchData();
    }
    private async DeleteData() {
        let web = Web(this.props.webURL);
        await web.lists.getByTitle("EmployeeDetails").items.getById(this.state.ID).delete()
            .then(i => {
                console.log(i);
            });
        alert("Deleted Successfully");
        this.setState({ EmployeeName: "", HireDate: null, JobDescription: "" });
        this.fetchData();
    }



    public render(): React.ReactElement<IOnboardingformProps> {
        return (
            <div>
                <h1>New Empoloyee Onboarding</h1>
                {/* {this.state.HTML} */}

                <div >
                    <form>
                        <div >
                            <Label>Firs Name</Label>
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
                            <Label>IT Equipments</Label>
                            <div className={styles.togglegroup}>
                                <div><Toggle
                                    // defaultChecked={false}
                                    checked={this.state.tgl}
                                    label="Mobile"
                                    onText="Yes"
                                    offText="No"
                                    // onChange={this._onChange}
                                    onChanged={checked => this.setState({ tgl: checked })}
                                />
                                </div>
                                <div>
                                    <Toggle
                                        defaultChecked={false}
                                        label="Surface Pro"
                                        onText="Yes"
                                        offText="No"
                                    // onChange={this._onChange}
                                    />
                                </div>
                                <div>
                                    <Toggle
                                        defaultChecked={false}
                                        label="Tablet"
                                        onText="Yes"
                                        offText="No"
                                    // onChange={newValue => this.setState(this.state.tgl: newValue ) }
                                    />
                                </div>
                            </div>
                            <Label>System Access Requirements</Label>
                            <div className={styles.togglegroup}>

                                <div>
                                    <Toggle
                                        defaultChecked={false}
                                        label="Carelink"
                                        onText="Yes"
                                        offText="No"
                                    // onChange={newValue => this.setState(this.state.tgl: newValue ) }
                                    />
                                </div>
                                <div>
                                    <Toggle
                                        defaultChecked={false}
                                        label="DocSign"
                                        onText="Yes"
                                        offText="No"
                                    // onChange={newValue => this.setState(this.state.tgl: newValue ) }
                                    />
                                </div>
                                <div>
                                    <Toggle
                                        defaultChecked={false}
                                        label="Epicor"
                                        onText="Yes"
                                        offText="No"
                                    // onChange={newValue => this.setState(this.state.tgl: newValue ) }
                                    />
                                </div>
                                <div>
                                    <Toggle
                                        defaultChecked={false}
                                        label="ICare"
                                        onText="Yes"
                                        offText="No"
                                    // onChange={newValue => this.setState(this.state.tgl: newValue ) }
                                    />
                                </div>
                                <div>
                                    <Toggle
                                        defaultChecked={false}
                                        label="Riskman"
                                        onText="Yes"
                                        offText="No"
                                    // onChange={newValue => this.setState(this.state.tgl: newValue ) }
                                    />
                                </div>
                            </div>
                            <br />

                        </div>

                    </form>
                </div>
                <div className={styles.btngroup}>
                    <div><PrimaryButton text="Submit" onClick={() => this.SaveData()} /></div>
                    <div><PrimaryButton text="Reset" onClick={() => this.ResetData()} /></div>
                    <div><PrimaryButton text="Update" onClick={() => this.UpdateData()} /></div>
                    <div><PrimaryButton text="Delete" onClick={() => this.DeleteData()} /></div>

                </div>
            </div>
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
    return month + '/' + day + '/' + year;
};