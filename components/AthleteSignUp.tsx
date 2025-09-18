
import React, { useState, useMemo, FC } from 'react';
import { User, UserRole, Sport, Gender } from '../types';
import { SPORTS_LIST, GENDERS_LIST } from '../constants';
import TrophyIcon from './icons/TrophyIcon';

interface InputFieldProps {
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const InputField: FC<InputFieldProps> = ({ name, label, type = 'text', value, onChange, required = true }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-brand-gray">{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors duration-150 ease-in-out"
    />
  </div>
);

interface SelectFieldProps {
  name: string;
  label: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectField: FC<SelectFieldProps> = ({ name, label, value, options, onChange }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-brand-gray">{label}</label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary rounded-md transition-colors duration-150 ease-in-out"
    >
      {options.map(option => <option key={option} value={option}>{option}</option>)}
    </select>
  </div>
);

interface AthleteSignUpProps {
  onSignUp: (user: User) => void;
  onBack: () => void;
}

const AthleteSignUp: FC<AthleteSignUpProps> = ({ onSignUp, onBack }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    contact: '',
    sport: Sport.ATHLETICS,
    gender: Gender.MALE,
    roleInSport: '',
  });

  const age = useMemo(() => {
    if (!formData.dob) return 0;
    const birthDate = new Date(formData.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }, [formData.dob]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value as any }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(age) || age <= 0) {
        alert("Please enter a valid date of birth.");
        return;
    }
    if (!formData.roleInSport.trim()) {
        alert("Please enter your role in the sport.");
        return;
    }
    const newUser: User = {
      id: `user_${Date.now()}`,
      age,
      ...formData,
      role: UserRole.ATHLETE,
    };
    onSignUp(newUser);
  };

  return (
    <div className="min-h-screen bg-brand-light flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <TrophyIcon className="w-16 h-16 text-brand-primary mx-auto" />
            <h2 className="mt-4 text-3xl font-extrabold text-brand-dark">Athlete Registration</h2>
            <p className="mt-2 text-brand-gray">Your journey to sporting excellence starts here.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField name="firstName" label="First Name" value={formData.firstName} onChange={handleChange} />
                <InputField name="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} />
            </div>
            <InputField name="dob" label="Date of Birth" type="date" value={formData.dob} onChange={handleChange} />
             {age > 0 && <p className="text-sm text-brand-gray -mt-4">You are {age} years old.</p>}
            <InputField name="contact" label="Phone or Email" type="text" value={formData.contact} onChange={handleChange} />
            <SelectField name="gender" label="Gender" value={formData.gender} options={GENDERS_LIST} onChange={handleChange} />
            <SelectField name="sport" label="Primary Sport" value={formData.sport} options={SPORTS_LIST} onChange={handleChange} />
            <InputField 
                name="roleInSport"
                label="Role in Sport (e.g. Bowler, Goalkeeper)"
                type="text"
                value={formData.roleInSport}
                onChange={handleChange}
                required={true}
            />
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onBack}
                className="w-1/3 flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-brand-dark bg-white hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button type="submit" className="w-2/3 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors">
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AthleteSignUp;
