package com.salesforce.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;

public class LoginPage {
    private WebDriverWait wait;

    @FindBy(xpath = "//input[@id='username']")
    private WebElement usernameInput;

    @FindBy(xpath = "//input[@id='password']")
    private WebElement passwordInput;

    @FindBy(xpath = "//input[@id='Login']")
    private WebElement loginButton;

    @FindBy(xpath = "//div[@id='error']")
    private WebElement errorMessage;

    public LoginPage(WebDriver driver) {
        try {
            this.wait = new WebDriverWait(driver, Duration.ofSeconds(15));
            PageFactory.initElements(driver, this);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void enterUsername(String username) {
        try {
            wait.until(ExpectedConditions.visibilityOf(usernameInput)).sendKeys(username);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void enterPassword(String password) {
        try {
            wait.until(ExpectedConditions.visibilityOf(passwordInput)).sendKeys(password);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void clickLoginButton() {
        try {
            wait.until(ExpectedConditions.elementToBeClickable(loginButton)).click();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void performLogin(String username, String password) {
        try {
            enterUsername(username);
            enterPassword(password);
            clickLoginButton();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public String getErrorMessage() {
        try {
            return wait.until(ExpectedConditions.visibilityOf(errorMessage)).getText();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
