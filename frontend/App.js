import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Platform,
  SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { createStudent, deleteStudent, getAttendance, getStudents, markAttendance } from './src/services/api';

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

export default function App() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [className, setClassName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(today());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setError('');
      const [studentData, attendanceData] = await Promise.all([getStudents(), getAttendance(date)]);
      setStudents(studentData);
      setAttendance(attendanceData);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [date]);

  useEffect(() => { load(); }, [load]);

  const addStudent = async () => {
    if (!name.trim() || !rollNumber.trim()) {
      Alert.alert('Required fields', 'Enter student name and roll number.');
      return;
    }
    try {
      setSaving(true);
      await createStudent({ name: name.trim(), rollNumber: rollNumber.trim(), className: className.trim(), email: email.trim() || null });
      setName(''); setRollNumber(''); setClassName(''); setEmail('');
      await load();
      Alert.alert('Success', 'Student added.');
    } catch (e) { Alert.alert('Could not add student', e.message); }
    finally { setSaving(false); }
  };

  const setStatus = async (studentId, status) => {
    try {
      await markAttendance({ studentId, attendanceDate: date, status });
      await load();
    } catch (e) { Alert.alert('Attendance not saved', e.message); }
  };

  const removeStudent = (student) => Alert.alert('Delete student?', `Remove ${student.name}?`, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: async () => {
      try { await deleteStudent(student.id); await load(); }
      catch (e) { Alert.alert('Delete failed', e.message); }
    }}
  ]);

  const marked = new Map(attendance.map(a => [a.student.id, a.status]));
  const present = attendance.filter(a => a.status === 'PRESENT').length;
  const absent = attendance.filter(a => a.status === 'ABSENT').length;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.eyebrow}>SCHOOL ADMINISTRATION</Text>
          <Text style={styles.title}>Student Attendance</Text>
          <Text style={styles.subtitle}>Manage students and daily attendance.</Text>

          <View style={styles.stats}>
            <View style={styles.stat}><Text style={styles.statNumber}>{students.length}</Text><Text style={styles.statLabel}>Students</Text></View>
            <View style={styles.stat}><Text style={[styles.statNumber,{color:'#16834a'}]}>{present}</Text><Text style={styles.statLabel}>Present today</Text></View>
            <View style={styles.stat}><Text style={[styles.statNumber,{color:'#c24141'}]}>{absent}</Text><Text style={styles.statLabel}>Absent today</Text></View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Add a student</Text>
            <TextInput style={styles.input} placeholder="Student name *" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Roll number *" value={rollNumber} onChangeText={setRollNumber} autoCapitalize="characters" />
            <TextInput style={styles.input} placeholder="Class (e.g. Java Batch A)" value={className} onChangeText={setClassName} />
            <TextInput style={styles.input} placeholder="Email (optional)" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <TouchableOpacity style={styles.primaryButton} onPress={addStudent} disabled={saving}>
              <Text style={styles.primaryButtonText}>{saving ? 'Saving...' : '+ Add student'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Daily attendance</Text>
            <Text style={styles.helper}>Date (YYYY-MM-DD)</Text>
            <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="2026-11-13" />
            <Text style={styles.helper}>Tap Present or Absent for each student. You can change a saved status.</Text>
            {loading ? <ActivityIndicator size="large" color="#3659c9" /> :
              error ? <Text style={styles.error}>{error}{'\n'}Check that the Spring Boot API is running and the mobile API URL is correct.</Text> :
              students.length === 0 ? <Text style={styles.empty}>No students yet. Add your first student above.</Text> :
              students.map(student => (
                <View key={student.id} style={styles.studentRow}>
                  <View style={{flex:1}}>
                    <Text style={styles.studentName}>{student.name}</Text>
                    <Text style={styles.studentMeta}>{student.rollNumber}{student.className ? ` • ${student.className}` : ''}</Text>
                    <Text style={styles.statusText}>Status: {marked.get(student.id) || 'Not marked'}</Text>
                  </View>
                  <View style={styles.actions}>
                    <TouchableOpacity onPress={() => setStatus(student.id,'PRESENT')} style={[styles.statusButton, styles.presentButton, marked.get(student.id)==='PRESENT' && styles.selected]}>
                      <Text style={styles.statusButtonText}>P</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setStatus(student.id,'ABSENT')} style={[styles.statusButton, styles.absentButton, marked.get(student.id)==='ABSENT' && styles.selected]}>
                      <Text style={styles.statusButtonText}>A</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => removeStudent(student)} style={styles.deleteButton}>
                      <Text style={styles.deleteText}>×</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            }
            <TouchableOpacity style={styles.secondaryButton} onPress={load}><Text style={styles.secondaryText}>Refresh</Text></TouchableOpacity>
          </View>
          <Text style={styles.footer}>Student Attendance App • React Native + Spring Boot</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#f4f6fb'}, container:{padding:20,paddingTop:32,paddingBottom:40},
  eyebrow:{fontSize:11,fontWeight:'700',letterSpacing:1.5,color:'#5369b2'},
  title:{fontSize:28,fontWeight:'800',color:'#17213b',marginTop:7}, subtitle:{fontSize:14,color:'#68738a',marginTop:5,marginBottom:20},
  stats:{flexDirection:'row',gap:10,marginBottom:16}, stat:{flex:1,backgroundColor:'#fff',padding:14,borderRadius:14,elevation:1},
  statNumber:{fontSize:24,fontWeight:'800',color:'#263a77'},statLabel:{fontSize:11,color:'#68738a',marginTop:4},
  card:{backgroundColor:'#fff',padding:16,borderRadius:16,marginBottom:16,elevation:1},
  sectionTitle:{fontSize:18,fontWeight:'700',color:'#17213b',marginBottom:12},input:{backgroundColor:'#f6f7fb',borderWidth:1,borderColor:'#e4e8f1',borderRadius:10,padding:12,marginBottom:10,fontSize:14},
  primaryButton:{backgroundColor:'#3659c9',padding:14,borderRadius:10,alignItems:'center',marginTop:2},primaryButtonText:{color:'#fff',fontWeight:'700'},
  helper:{fontSize:12,color:'#68738a',marginBottom:8},studentRow:{flexDirection:'row',alignItems:'center',paddingVertical:13,borderBottomWidth:1,borderBottomColor:'#edf0f5'},
  studentName:{fontSize:15,fontWeight:'700',color:'#202b45'},studentMeta:{fontSize:12,color:'#778198',marginTop:3},statusText:{fontSize:11,color:'#5369b2',marginTop:4},
  actions:{flexDirection:'row',alignItems:'center',gap:6},statusButton:{width:32,height:32,borderRadius:9,alignItems:'center',justifyContent:'center'},
  presentButton:{backgroundColor:'#dff5e8'},absentButton:{backgroundColor:'#fde7e7'},selected:{borderWidth:2,borderColor:'#283d82'},statusButtonText:{fontWeight:'800',color:'#24314f'},
  deleteButton:{width:28,height:32,alignItems:'center',justifyContent:'center'},deleteText:{fontSize:24,color:'#b64b4b'},secondaryButton:{padding:12,alignItems:'center',marginTop:10},secondaryText:{color:'#3659c9',fontWeight:'700'},
  empty:{color:'#7b8498',paddingVertical:15},error:{color:'#b42318',lineHeight:20},footer:{textAlign:'center',fontSize:11,color:'#929bad',marginTop:4}
});
