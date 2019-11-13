import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    button: {
        float: 'right',
        position: 'relative',
    }
}));

export default function TransitionsModal(props) {
    const classes = useStyles();

    const handleClose = () => {
        props.setDeleteWarning(false);
    };

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={props.deleteWarning}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={props.deleteWarning}>
                <div className={classes.paper}>
                    <h2 id="transition-modal-title">Supprimer formation</h2>
                    <p id="transition-modal-description">Voulez-vous vraiment supprimer cette formation ?</p>
                    <button type="button" onClick={props.deleteTraining}>
                        Supprimer
                    </button>
                    <button type="button" className={classes.button} onClick={handleClose}>
                        Annuler
                    </button>
                </div>
                </Fade>
            </Modal>
        </div>
    );
}