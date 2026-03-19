package com.salesforce.tests;

import com.salesforce.base.BaseTest;
import com.salesforce.pages.LoginPage;
import org.testng.Assert;
import org.testng.annotations.Test;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;

public class LoginTest extends BaseTest {

    @Test
    public void validLoginTest() {
        try {
            LoginPage loginPage = new LoginPage(driver);
            loginPage.performLogin("valid.user@salesforce.com", "ValidPass123!");
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
            boolean urlChanged = wait.until(ExpectedConditions.not(ExpectedConditions.urlToBe("https://login.salesforce.com/?locale=in")));
            Assert.assertTrue(urlChanged);
        } catch (Exception e) {
            Assert.fail(e.getMessage());
        }
    }

    @Test
    public void invalidLoginTest() {
        try {
            LoginPage loginPage = new LoginPage(driver);
            loginPage.performLogin("invalid.user@salesforce.com", "WrongPassword!");
            String errorMsg = loginPage.getErrorMessage();
            Assert.assertNotNull(errorMsg);
            Assert.assertTrue(errorMsg.contains("check your username and password"));
        } catch (Exception e) {
            Assert.fail(e.getMessage());
        }
    }
}
