'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { EyeIcon, EyeOffIcon, UserPlus, Upload, FileText, Award, Building2, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function DoctorSignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    licenseNumber: '',
    specialization: '',
    yearsOfExperience: '',
    hospital: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    licenseFile: null as File | null,
    degreeFile: null as File | null,
    idProofFile: null as File | null,
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [field]: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, value);
        }
      });

      const res = await fetch('http://localhost:3000/api/auth/doctor-signup', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.msg || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      router.push('/doctor');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-card p-8 rounded-2xl shadow-2xl border border-border"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image 
              src="/mindguard_logo.png" 
              alt="MindGuard Logo" 
              width={64} 
              height={64}
              className="rounded-lg"
            />
          </div>
          <h2 className="text-3xl font-bold text-foreground font-poppins">Doctor Registration</h2>
          <p className="text-primary text-sm mt-2">Complete your professional profile</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 bg-destructive text-destructive-foreground p-3 rounded-lg flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-foreground font-medium mb-2">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-ring text-foreground transition-all duration-200"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-foreground font-medium mb-2">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-ring text-foreground transition-all duration-200"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-foreground font-medium mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="tel"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-ring text-foreground transition-all duration-200"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-foreground font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full px-4 py-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-ring text-foreground transition-all duration-200"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-foreground font-medium mb-2">Medical License Number</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-ring text-foreground transition-all duration-200"
                  placeholder="Enter your license number"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-foreground font-medium mb-2">Specialization</label>
              <div className="relative">
                <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-ring text-foreground transition-all duration-200"
                  placeholder="Enter your specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-foreground font-medium mb-2">Years of Experience</label>
              <input
                type="number"
                required
                min="0"
                className="w-full px-4 py-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-ring text-foreground transition-all duration-200"
                placeholder="Enter years of experience"
                value={formData.yearsOfExperience}
                onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-foreground font-medium mb-2">Hospital/Clinic</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-ring text-foreground transition-all duration-200"
                  placeholder="Enter hospital/clinic name"
                  value={formData.hospital}
                  onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-foreground font-medium mb-2">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-ring text-foreground transition-all duration-200"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-foreground font-medium mb-2">City</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-ring text-foreground transition-all duration-200"
                placeholder="Enter your city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-foreground font-medium mb-2">State</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-ring text-foreground transition-all duration-200"
                placeholder="Enter your state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-foreground font-medium mb-2">Country</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-ring text-foreground transition-all duration-200"
                placeholder="Enter your country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-foreground font-medium mb-2">ZIP Code</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-ring text-foreground transition-all duration-200"
                placeholder="Enter your ZIP code"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              />
            </div>
          </div>

          {/* Document Uploads */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Required Documents</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-foreground font-medium mb-2">Medical License</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-input rounded-lg cursor-pointer bg-background hover:bg-muted transition-colors duration-200">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">PDF, JPG, PNG (MAX. 2MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, 'licenseFile')}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-foreground font-medium mb-2">Medical Degree</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-input rounded-lg cursor-pointer bg-background hover:bg-muted transition-colors duration-200">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">PDF, JPG, PNG (MAX. 2MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, 'degreeFile')}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-foreground font-medium mb-2">ID Proof</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-input rounded-lg cursor-pointer bg-background hover:bg-muted transition-colors duration-200">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">PDF, JPG, PNG (MAX. 2MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, 'idProofFile')}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              required
              className="h-4 w-4 text-primary border-input rounded focus:ring-ring"
            />
            <label className="ml-2 block text-sm text-foreground">
              I certify that all information provided is accurate and I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-300 shadow-md flex items-center justify-center space-x-2"
          >
            <UserPlus size={20} />
            <span>Register as Doctor</span>
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-foreground">
            Already have an account?{' '}
            <Link href="/doctor-login" className="text-primary hover:text-primary/80 font-medium transition-colors duration-200">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
} 