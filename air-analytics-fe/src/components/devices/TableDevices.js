import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import { FormControlLabel, Grid, IconButton, InputAdornment, SvgIcon, Switch, TextField, useMediaQuery, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { gridSpacing } from '../../constants/theme';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { apiGetAllDevice, apiUpdateDevice } from '../../services/Device';
import EditDeviceModal from './EditDeviceModal';
import { useDispatch } from 'react-redux';
import { closeLoadingModal, openLoadingModal } from '../../redux/loadingSlice';
import { openAlertModal } from '../../redux/alertSlice';


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'name',
        disablePadding: false,
        label: 'Name',
    },
    {
        id: 'id',
        disablePadding: false,
        label: 'Device ID',
    },
    {
        id: 'user_id',
        disablePadding: false,
        label: 'User ID',
    },
    {
        id: 'position',
        disablePadding: false,
        label: 'Position'
    },
    {
        id: 'state',
        disablePadding: false,
        label: 'State'
    },
    {
        id: 'action',
        disablePadding: false,
        label: '',
    },
];

function BasicTable(props) {
    const { order, orderBy, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell >
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

BasicTable.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

export default function TableDevices(props) {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [count, setCount] = useState(5);
    const [devices, setDevices] = useState([]);
    const [open, setOpen] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [selectedId, setSelectedId] = useState({
        name: '',
        position: ''
    });
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAPI = async() => {
            try {
                const response = await apiGetAllDevice();
                setDevices(response.data);
                setCount(response.data.length);
            } catch(err) {
                console.log(err);
            }
        }

        fetchAPI();
    }, [props.load, updated])

    const handleClose = useCallback(() => {
        setOpen(false);
    }, [])

    const handleChangeUpdate = useCallback(() => {
        setUpdated((preState) => !preState);
    }, [])

    const handleOpen = (row) => {
        setSelectedId((pre) => row);
        setOpen(true);
    }

    const handleChangeState = (row) => async(event) => {
        let dataAlert = {
            isOpen: false,
            severity: 'success',
            message: ''
        }
        try {
            dispatch(openLoadingModal());
            let rowUpdate = {
                ...row,
                state: event.target.checked ? 1 : 0,
            }
            const response = await apiUpdateDevice(rowUpdate.id, rowUpdate);
            dispatch(closeLoadingModal());
            if (response) {
                dataAlert = { ...dataAlert, isOpen: true, 
                    message: !event.target.checked ? 'Mở thiết bị thành cônng' : 'Tắt thiết bị thành công'
                }
                dispatch(openAlertModal(dataAlert));
                handleChangeUpdate();
            }
        } catch(err) {
            dispatch(closeLoadingModal());
            dataAlert = { ...dataAlert, isOpen: true, severity: 'error',
                message: !event.target.checked ? 'Mở thiết bị thất bại' : 'Tắt thiết bị thất bại'
            }
            dispatch(openAlertModal(dataAlert));
            console.log(err);
        }

    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - count) : 0;

    return (
        <Box sx={{ width: '100%' }}>
            <Grid container spacing={gridSpacing} justifyContent="space-between" alignItems="center">
                <Grid item xs={4}>
                    <Typography variant='h5' color={"primary"}>List Device</Typography>
                </Grid>
                <Grid item xs={4}>
                    {/* <TextField
                        fullWidth
                        value={searchBook}
                        onChange={handleChangeSearchCustomer}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SvgIcon
                                        color="action"
                                        fontSize="small"
                                    >
                                        <SearchIcon />
                                    </SvgIcon>
                                </InputAdornment>
                            )
                        }}
                        // size="small"
                        placeholder="Search device"
                        variant="outlined"
                        sx={{
                            '& .MuiInputBase-input': {
                                bgcolor: theme.palette.background.default
                            },
                            '& .MuiOutlinedInput-root': {
                                bgcolor: theme.palette.background.default
                            }
                        }}
                    /> */}
                </Grid>
            </Grid>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table
                        aria-labelledby="tableTitle"
                        size='medium'
                    >
                        <BasicTable
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={count}
                        />
                        <TableBody>
                            {stableSort(devices, getComparator(order, orderBy))
                                ?.map((row, index) => {
                                    return (
                                        <TableRow
                                            hover
                                            sx={{ cursor: 'pointer' }}
                                            key={row.id}
                                        >
                                            <TableCell ></TableCell>
                                            {headCells.map((p, index) => {
                                                return p.id === 'state' ? (
                                                    <TableCell
                                                        sx={{ 
                                                            minWidth: '9em',
                                                            color: row[p.id] === 1 ? '#28a745' : '#dc3545'
                                                        }}
                                                        key={p.id}
                                                    >
                                                        <FormControlLabel 
                                                            control={<Switch checked={row[p.id] === 1} onChange={handleChangeState(row)}/>} 
                                                            label={row[p.id] === 1 ? 'ON' : 'OFF'}             
                                                        />
                                                    </TableCell>
                                                ) : p.id === 'action' ? (
                                                    <TableCell key={p.id}>
                                                        <Grid sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                            <IconButton onClick={() => handleOpen(row)}>
                                                                <EditIcon color='primary'/>
                                                            </IconButton>
                                                            <IconButton>
                                                                <DeleteIcon color='error'/>
                                                            </IconButton>
                                                        </Grid>
                                                    </TableCell>
                                                ) : (
                                                    <TableCell key={p.id} sx={{ minWidth: '9em' }}>{row[p.id]}</TableCell>
                                                )
                                            })}
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={7} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={matchDownSM ? [] : [5, 10, 25]}
                    component="div"
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <EditDeviceModal 
                open={open}
                onClose={handleClose}
                onUpdate={handleChangeUpdate}
                data={selectedId}
            />
        </Box>
    );
}