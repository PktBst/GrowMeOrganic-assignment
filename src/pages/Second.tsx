import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import axios from 'axios';
import DepartmentTree from '../components/DepartmentTree';

interface Post {
  id: number;
  title: string;
  body: string;
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'title', headerName: 'Title', width: 150 },
  { field: 'body', headerName: 'Body', width: 150 },
];

const Second: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/');
    } else {
      axios.get('https://jsonplaceholder.typicode.com/posts')
        .then(response => {
          setPosts(response.data);
          setLoading(false);
        });
    }
  }, [navigate]);

  return (
    <Container>
      <Typography variant="h4">Posts</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={posts}
            columns={columns}
            checkboxSelection
            rowSelectionModel={selectionModel}
            onRowSelectionModelChange={(newSelectionModel: React.SetStateAction<GridRowSelectionModel>) => {
              setSelectionModel(newSelectionModel);
            }}
          />
        </div>
      )}
      <DepartmentTree />
    </Container>
  );
};

export default Second;
