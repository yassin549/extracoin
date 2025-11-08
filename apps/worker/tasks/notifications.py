from celery_app import app


@app.task(name="tasks.notifications.send_email")
def send_email(to_email: str, subject: str, body: str):
    """
    Send email notification.
    
    Will be implemented with proper email service in later phases.
    """
    print(f"[EMAIL] To: {to_email}, Subject: {subject}")
    return {"status": "sent", "to": to_email}


@app.task(name="tasks.notifications.send_trade_alert")
def send_trade_alert(user_id: str, trade_data: dict):
    """
    Send trade execution alert to user.
    """
    print(f"[ALERT] Trade alert for user {user_id}: {trade_data}")
    return {"status": "sent", "user_id": user_id}
