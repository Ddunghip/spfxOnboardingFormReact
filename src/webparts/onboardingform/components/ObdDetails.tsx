import * as React from 'react';
import styles from './Onboardingform.module.scss';
import { FormatDate } from './ObdForm'
type Props = {
    Items: any;
    finData: any;

};


export default class ObdDetails extends React.Component<Props> {
    static defaultProps = {
        Items: [],



    };
    constructor(props: any) {
        super(props)
    }

    render() {
        const Items = this.props;
        return (
            <div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Phone Number </th>
                            <th>Email </th>
                            <th>Start Date </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.Items && this.props.Items.map((item, i) => {
                            return [
                                <tr key={i} onClick={() => this.props.finData(item.ID)} >
                                    <td>{item.FirstName}</td>
                                    <td>{item.LastName}</td>
                                    <td>{item.PhoneNumber}</td>
                                    <td>{item.Email}</td>
                                    <td>{FormatDate(item.StartDate)}</td>
                                    {/* <td>{item.Workstation_x0020_Description}</td>
                                    <td>{item.Existing_x0020_Phone_x0020_Numbe}</td> */}


                                </tr>
                            ];
                        })}
                    </tbody>
                </table>
            </div >
        )
    }
}