/**
 * Program-Branch Mapping Page
 * Map branches to programs
 */

import { useState, useEffect } from 'react';
import { Card, Row, Col, List, Checkbox, Button, Tag, Typography, Empty, Spin } from 'antd';
import { SaveOutlined, LinkOutlined } from '@ant-design/icons';
import PageHeader from '@/components/common/PageHeader';
import { programsService, branchesService, programBranchMapService } from '@/services/adminMockService';
import useAppStore from '@/store/useAppStore';
import './CrudPage.css';

const { Text } = Typography;

const ProgramBranchMapping = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [mappings, setMappings] = useState({});
  const { showSuccess, showError } = useAppStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [programsRes, branchesRes, mappingsRes] = await Promise.all([
          programsService.getAll(),
          branchesService.getAll(),
          programBranchMapService.getAll()
        ]);

        const programsData = programsRes.data;
        const branchesData = branchesRes.data;
        const mappingsData = mappingsRes.data;

        setPrograms(programsData);
        setBranches(branchesData);

        // Initialize mappings from service data
        const initialMappings = {};
        programsData.forEach(program => {
          initialMappings[program.id] = mappingsData
            .filter(m => m.programId === program.id)
            .map(m => m.branchId);
        });
        setMappings(initialMappings);
        
        if (programsData.length > 0) {
          setSelectedProgram(programsData[0].id);
        }
      } catch (error) {
        showError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProgramSelect = (programId) => {
    setSelectedProgram(programId);
  };

  const handleBranchToggle = (branchId) => {
    if (!selectedProgram) return;
    
    setMappings(prev => {
      const currentMappings = prev[selectedProgram] || [];
      const isSelected = currentMappings.includes(branchId);
      
      return {
        ...prev,
        [selectedProgram]: isSelected
          ? currentMappings.filter(id => id !== branchId)
          : [...currentMappings, branchId],
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess('Mappings saved successfully');
    } catch {
      showError('Failed to save mappings');
    } finally {
      setSaving(false);
    }
  };

  const selectedBranches = selectedProgram ? (mappings[selectedProgram] || []) : [];

  if (loading) {
    return (
      <div className="crud-page" style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="crud-page">
      <PageHeader
        title="Program-Branch Mapping"
        subtitle="Assign branches to academic programs"
        showAdd={false}
        showRefresh={false}
        extra={
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            onClick={handleSave}
            loading={saving}
          >
            Save Mappings
          </Button>
        }
      />

      <Row gutter={24}>
        {/* Programs List */}
        <Col xs={24} md={10}>
          <Card 
            title="Programs" 
            className="mapping-panel"
            size="small"
          >
            <List
              dataSource={programs}
              renderItem={(program) => (
                <List.Item
                  className={`mapping-item ${selectedProgram === program.id ? 'selected' : ''}`}
                  onClick={() => handleProgramSelect(program.id)}
                >
                  <div>
                    <Text strong>{program.name}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>{program.code}</Text>
                  </div>
                  <Tag color="blue">
                    {(mappings[program.id] || []).length} branches
                  </Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Branches Assignment */}
        <Col xs={24} md={14}>
          <Card 
            title={
              <span>
                <LinkOutlined style={{ marginRight: 8 }} />
                Assign Branches
                {selectedProgram && (
                  <Text type="secondary" style={{ fontWeight: 'normal', marginLeft: 8 }}>
                    to {programs.find(p => p.id === selectedProgram)?.name}
                  </Text>
                )}
              </span>
            }
            className="assignment-panel"
            size="small"
          >
            {selectedProgram ? (
              <List
                dataSource={branches}
                renderItem={(branch) => (
                  <List.Item className="assignment-item">
                    <Checkbox
                      checked={selectedBranches.includes(branch.id)}
                      onChange={() => handleBranchToggle(branch.id)}
                    >
                      <span style={{ marginLeft: 8 }}>
                        {branch.name}
                        <Tag style={{ marginLeft: 8 }}>{branch.code}</Tag>
                      </span>
                    </Checkbox>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="Select a program to assign branches" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProgramBranchMapping;
