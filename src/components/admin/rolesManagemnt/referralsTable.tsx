import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { api_url } from "../../../../utils/apiCall";
interface Referral {
  _id: string;
  name: string;
  email: string;
  referredByName: string;
}

const ReferralsTable: React.FC = () => {
        const [referrals, setReferrals] = useState<Referral[]>([]);
        const [loading, setLoading] = useState<boolean>(true);
        const [error, setError] = useState<string | null>(null);

        useEffect(() => {
                const fetchReferrals = async () => {
                        try {
                                const res = await axios.get(
                                  `${api_url}referrals`,
                                  {
                                    // Add required payload here (e.g., email, password)
                                  }
                                );
                                // Adjust the path to referrals data as per your API response
                                console.log(res);
                                
                                setReferrals(res.data.referrals || []);
                        } catch (err: any) {
                                setError('Failed to fetch referrals');
                        } finally {
                                setLoading(false);
                        }
                };
                fetchReferrals();
        }, []);

        if (loading) return <div>Loading...</div>;
        if (error) return <div>{error}</div>;

        return (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>ID</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                  Name
                </th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                  Email
                </th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                  Referred By
                </th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((referral) => (
                <tr key={referral._id}>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {referral._id}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {referral.name}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {referral.email}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {referral.referredByName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
};



export default ReferralsTable;