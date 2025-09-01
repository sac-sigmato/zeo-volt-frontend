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
          <div className="overflow-x-auto rounded-lg shadow bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Referred By
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {referrals.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-gray-500 italic"
                    >
                      No referrals found.
                    </td>
                  </tr>
                ) : (
                  referrals.map((referral) => (
                    <tr
                      key={referral._id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                        {referral._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                        {referral.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                        {referral.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                        {referral.referredByName}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        );
};



export default ReferralsTable;