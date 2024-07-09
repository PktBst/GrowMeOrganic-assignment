import React, { useState } from 'react';
import { Container, Typography, Checkbox, List, ListItem, ListItemIcon, ListItemText, IconButton, Collapse } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Department {
  department: string;
  sub_departments: string[];
}

const departments: Department[] = [
  {
    department: 'customer_service',
    sub_departments: [
      'support',
      'customer_success',
    ],
  },
  {
    department: 'design',
    sub_departments: [
      'graphic_design',
      'product_design',
      'web_design',
    ],
  },
];

const DepartmentTree: React.FC = () => {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const handleToggle = (name: string) => {
    setExpanded(expanded.includes(name) ? expanded.filter(n => n !== name) : [...expanded, name]);
  };

  const handleSelect = (name: string, parent?: string) => {
    let newSelected = [...selected];
    if (newSelected.includes(name)) {
      // Deselect the item and its children if it's a department
      newSelected = newSelected.filter(n => n !== name);
      const department = departments.find(dept => dept.department === name);
      if (department) {
        department.sub_departments.forEach(subDept => {
          newSelected = newSelected.filter(n => n !== subDept);
        });
      }
      // If a sub-department is deselected, the parent department should also be deselected
      if (parent) {
        newSelected = newSelected.filter(n => n !== parent);
      }
    } else {
      // Select the item and its children
      newSelected.push(name);
      if (parent) {
        const parentDept = departments.find(dept => dept.department === parent);
        if (parentDept) {
          const allSubSelected = parentDept.sub_departments.every(sub => newSelected.includes(sub));
          if (allSubSelected) {
            newSelected.push(parent);
          }
        }
      } else {
        const dept = departments.find(dept => dept.department === name);
        if (dept) {
          dept.sub_departments.forEach(subDept => {
            if (!newSelected.includes(subDept)) {
              newSelected.push(subDept);
            }
          });
        }
      }
    }
    setSelected(newSelected);
  };

  const renderDepartment = (department: Department) => {
    const isExpanded = expanded.includes(department.department);
    const isSelected = selected.includes(department.department);

    return (
      <List key={department.department}>
        <ListItem>
          {department.sub_departments.length > 0 && (
            <IconButton onClick={() => handleToggle(department.department)}>
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
          <ListItemIcon>
            <Checkbox
              checked={isSelected}
              onClick={() => handleSelect(department.department)}
            />
          </ListItemIcon>
          <ListItemText primary={department.department} />
        </ListItem>
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {department.sub_departments.map(subDept => {
              const isSubSelected = selected.includes(subDept);
              return (
                <ListItem key={subDept} style={{ paddingLeft: 40 }}>
                  <ListItemIcon>
                    <Checkbox
                      checked={isSubSelected}
                      onClick={() => handleSelect(subDept, department.department)}
                    />
                  </ListItemIcon>
                  <ListItemText primary={subDept} />
                </ListItem>
              );
            })}
          </List>
        </Collapse>
      </List>
    );
  };

  return (
    <Container>
      <Typography variant="h5">Departments</Typography>
      {departments.map(department => renderDepartment(department))}
    </Container>
  );
};

export default DepartmentTree;
